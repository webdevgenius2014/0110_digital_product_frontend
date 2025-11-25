import Three from "./Three";
import { debounceWithHooks } from "./helpers";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial";
import * as THREE from "three";
import * as lil from "three/addons/libs/lil-gui.module.min.js";
import html2canvas from "html2canvas-pro";
import {
  RoundedBoxGeometry,
  HueSaturationShader,
  ColorCorrectionShader,
  FXAAShader,
} from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import mobileBarVs from "./shaders/mobileBarVs.glsl?raw";
import mobileBarFs from "./shaders/mobileBarFs.glsl?raw";
import { clamp } from "three/src/math/MathUtils.js";

// import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
// import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// import { SMAAPass } from "three/examples/jsm/Addons.js";

const CAPSULE_PARAMS = {
  // Physical Material
  roughness: 0,
  metalness: 0.07,
  clearcoat: 0.4,
  clearcoatRoughness: 0.05,
  ior: 1.1,
  iridescence: 1,
  iridescenceIOR: 1,
  thickness: 80,
  backsideThickness: 0,
  reflectivity: 0.15,

  // Transition Material
  chromaticAberration: 0.02,
  anisotrophicBlur: 0.0,
  distortion: 0,
  distortionScale: 0.0,
  temporalDistortion: 0,
};

const CARD_PARAMS = {
  // Physical Material
  roughness: 0,
  metalness: 0.02,
  clearcoat: 0.1,
  clearcoatRoughness: 0.05,
  ior: 1.5,
  iridescence: 1,
  iridescenceIOR: 1.4,
  thickness: 27,
  backsideThickness: 0,
  reflectivity: 0.8,

  // Transition Material
  chromaticAberration: 2,
  anisotrophicBlur: 0.0,
  distortion: 0,
  distortionScale: 0.0,
  temporalDistortion: 0,
};

const MOBILE_BAR_PARAMS = {
  // Physical Material
  roughness: 0.06,
  metalness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  ior: 1.27,
  iridescence: 1,
  iridescenceIOR: 1,
  thickness: 208,
  backsideThickness: 0,
  reflectivity: 0.3,

  // Transition Material
  chromaticAberration: 0.15,
  anisotrophicBlur: 0.0,
  distortion: 0,
  distortionScale: 0.0,
  temporalDistortion: 0,
};

const POSTPROCESSING = {
  hue: 0,
  saturation: 0,
};

export default class LiquidGlassMeshes extends Three {
  constructor(domElement) {
    super(domElement);

    this.setResponsivenessValues();
    this.selectReferences();
    this.loadTextures();

    this.setPanel();

    this.addMobileTexturePlane();
    this.addDesktopTexturePlane();

    this.setMaterials();

    this.addCapsuleMesh();
    this.addCardMesh();
    this.addMobileBarMesh();

    // this.addPostprocessing(); // might be needed for color corrections
  }

  setResponsivenessValues() {
    let isTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };

    let isMobile = () => {
      return window.innerWidth < 1024;
    };

    this.isTouchDevice = isTouchDevice();
    this.isMobile = isMobile();

    window.addEventListener("resize", () => {
      this.isTouchDevice = isTouchDevice();
      this.isMobile = isMobile();
    });
  }

  selectReferences() {
    this.references = {};

    this.references.logo = document.getElementById("hero-section-logo");
    this.references.cards = document.getElementById("what-we-do-cards");
    this.references.mobileBar = document.getElementById("mobile-bar");
  }

  setPanel() {
    this.panel = new lil.GUI();
    this.panel.close();
  }

  addMobileTexturePlane() {
    let mobileBar = this.references.mobileBar;

    let geometry = new THREE.PlaneGeometry(1, 1);
    geometry.rotateX(-Math.PI * 0.5);
    let material = new THREE.ShaderMaterial({
      vertexShader: mobileBarVs,
      fragmentShader: mobileBarFs,
      uniforms: {
        uTexture: new THREE.Uniform(),
        uTextureHeight: new THREE.Uniform(0),
        uMeshHeight: new THREE.Uniform(this.sizes.height),
        uScreenHeight: new THREE.Uniform(window.innerHeight),
        uScrollY: new THREE.Uniform(0),
      },
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(mobileBar.offsetWidth, 1, mobileBar.offsetHeight);
    mesh.renderOrder = 2;

    this.onResize(() => {
      if (this.isMobile) {
        mesh.visible = true;

        material.uniforms.uMeshHeight.value = mobileBar.offsetHeight;
        material.uniforms.uScreenHeight.value = window.innerHeight;
      } else {
        mesh.visible = false;
      }
    });

    this.onTick(() => {
      if (this.isMobile) {
        material.uniforms.uScrollY.value = window.scrollY;
      }
    });

    this.scene.add(mesh);

    let texture;

    let updateTexture = debounceWithHooks(() => {
      if (!this.isMobile) {
        return;
      }

      html2canvas(document.body, {
        useCORS: false,
        scale: 1,
        windowWidth: document.documentElement.clientWidth,
      }).then((canvas) => {
        if (texture) {
          texture.dispose();
        }
        texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        material.uniforms.uTexture.value = texture;
        material.uniforms.uTextureHeight.value = canvas.height;
      });
    }, 300);

    updateTexture();
    window.addEventListener("resize", updateTexture);
  }

  addDesktopTexturePlane() {
    let geometry = new THREE.PlaneGeometry(1, 1);
    geometry.rotateX(-Math.PI * 0.5);
    let material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.EqualStencilFunc,
      stencilZPass: THREE.KeepStencilOp,
      stencilFail: THREE.KeepStencilOp,
      stencilZFail: THREE.KeepStencilOp,
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 2;
    mesh.scale.set(this.sizes.width, 1, this.sizes.height);

    this.onResize((sizes) => {
      if (this.isMobile) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
        mesh.scale.set(sizes.width, 1, sizes.height);
      }
    });

    this.scene.add(mesh);

    let texture;

    let updateTexture = debounceWithHooks(() => {
      if (this.isMobile) {
        return;
      }

      html2canvas(document.body, {
        useCORS: false,
        width: this.sizes.width,
        height: this.sizes.height,
        y: window.scrollY,
        scale: window.devicePixelRatio,
        windowWidth: document.documentElement.clientWidth,
      }).then((canvas) => {
        if (texture) {
          texture.dispose();
        }
        texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        material.map = texture;
        material.needsUpdate = true;
        material.color = new THREE.Color(1, 1, 1).multiplyScalar(1.2);
      });
    }, 300);

    updateTexture();
    window.addEventListener("resize", updateTexture);
    window.addEventListener("scroll", updateTexture);
  }

  loadTextures() {
    let loader = new THREE.TextureLoader();

    this.textures = {};
    let glass = loader.load("Glass-shape.png");
    glass.colorSpace = THREE.SRGBColorSpace;
    this.textures.glass = glass;
  }

  createMaterial(name, parameters, samples = 16) {
    let material = Object.assign(new MeshTransmissionMaterial(samples), {
      roughness: parameters.roughness,
      metalness: parameters.metalness,
      clearcoat: parameters.clearcoat,
      clearcoatRoughness: parameters.clearcoatRoughness,
      ior: parameters.ior,
      iridescence: parameters.iridescence,
      iridescenceIOR: parameters.iridescenceIOR,
      thickness: parameters.thickness,
      backsideThickness: parameters.backsideThickness,
      reflectivity: parameters.reflectivity,

      chromaticAberration: parameters.chromaticAberration,
      anisotrophicBlur: parameters.anisotrophicBlur,
      anisotrophicBlur: parameters.anisotrophicBlur,
      distortion: parameters.distortion,
      distortionScale: parameters.distortionScale,
      temporalDistortion: parameters.temporalDistortion,

      transmission: 1,

      iridescenceThicknessRange: [0, 140],
    });

    let folder = this.panel.addFolder(`${name} Material`);
    folder.close();

    folder.add(parameters, "roughness", 0, 1, 0.01).onChange((value) => {
      material.roughness = value;
    });

    folder.add(parameters, "metalness", 0, 1, 0.01).onChange((value) => {
      material.metalness = value;
    });

    folder.add(parameters, "clearcoat", 0, 1, 0.01).onChange((value) => {
      material.clearcoat = value;
    });

    folder
      .add(parameters, "clearcoatRoughness", 0, 1, 0.01)
      .onChange((value) => {
        material.clearcoatRoughness = value;
      });

    folder.add(parameters, "ior", 1, 2.3, 0.01).onChange((value) => {
      material.ior = value;
    });

    folder.add(parameters, "iridescence", 0, 1, 0.01).onChange((value) => {
      material.iridescence = value;
    });

    folder.add(parameters, "iridescenceIOR", 1, 2.3, 0.01).onChange((value) => {
      material.iridescenceIOR = value;
    });

    folder.add(parameters, "thickness", 0, 300, 1).onChange((value) => {
      material.thickness = value;
    });

    folder.add(parameters, "backsideThickness", 0, 300, 1).onChange((value) => {
      material.backsideThickness = value;
    });

    folder.add(parameters, "reflectivity", 0, 1, 0.01).onChange((value) => {
      material.reflectivity = value;
    });

    folder
      .add(parameters, "chromaticAberration", 0, 2, 0.01)
      .onChange((value) => {
        material.chromaticAberration = value;
      });

    folder
      .add(parameters, "anisotrophicBlur", 0, 10, 0.01)
      .onChange((value) => {
        material.anisotrophicBlur = value;
      });

    folder.add(parameters, "distortion", 0, 10, 0.01).onChange((value) => {
      material.distortion = value;
    });

    folder.add(parameters, "distortionScale", 0, 1, 0.01).onChange((value) => {
      material.distortionScale = value;
    });

    folder
      .add(parameters, "temporalDistortion", 0, 1, 0.01)
      .onChange((value) => {
        material.temporalDistortion = value;
      });

    return material;
  }

  setMaterials() {
    this.capsuleMaterial = this.createMaterial("Capsule", CAPSULE_PARAMS);
    this.cardMaterial = this.createMaterial("Card", CARD_PARAMS);
    this.mobileBarMaterial = this.createMaterial(
      "MobileBar",
      MOBILE_BAR_PARAMS,
      2
    );

    this.maskMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      colorWrite: false,
      depthWrite: false,
      depthTest: false,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilFail: THREE.KeepStencilOp,
      stencilZFail: THREE.KeepStencilOp,
      stencilZPass: THREE.ReplaceStencilOp,
    });
  }

  addCapsuleMesh() {
    let logo = this.references.logo;
    let capsule = {
      width: 0,
      height: 0,
      borderRadius: 0,
      center: new THREE.Vector2(),
      pointer: new THREE.Vector2(),
      position: new THREE.Vector2(),
      geometry: null,
      mesh: null,
      timeline: null,
      offset: 64,
      rangeTop: 80,
      rangeBottom: 4,
      limitTop: 0,
      limitBottom: 0,
      scale: 0,
    };

    let removeCapsuleMesh = () => {
      if (capsule.mesh) {
        capsule.mesh.visible = false;
        capsule.mesh.clear();
        this.scene.remove(capsule.mesh);
        capsule.mesh = null;
      }
    };

    let createCapsuleMesh = debounceWithHooks(
      () => {
        let rect = logo.getBoundingClientRect();

        capsule.width = logo.offsetWidth + capsule.offset;
        capsule.height = logo.offsetHeight * 1.12 + capsule.offset;
        capsule.borderRadius = Math.min(capsule.width, capsule.height);

        capsule.center.x =
          rect.left + rect.width * 0.5 - this.sizes.width * 0.5;
        capsule.center.y =
          rect.top + rect.height * 0.5 - this.sizes.height * 0.5 + 52;

        capsule.limitTop = capsule.center.y - capsule.rangeTop;
        capsule.limitBottom = capsule.center.y + capsule.rangeBottom;

        capsule.position.copy(capsule.center);
      },
      300,
      {
        onComplete: () => {
          removeCapsuleMesh();

          if (this.isMobile) {
            return;
          }

          capsule.geometry = new RoundedBoxGeometry(
            capsule.width,
            capsule.borderRadius,
            capsule.height,
            8,
            capsule.borderRadius
          );

          let mesh = new THREE.Mesh(capsule.geometry, this.capsuleMaterial);
          let glassShapeGeometry = new THREE.PlaneGeometry(
            capsule.width,
            capsule.height * 0.5
          );
          let glassShapeMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.glass,
            transparent: true,
            depthTest: false,
            opacity: 0.75,
          });
          let glassShape = new THREE.Mesh(
            glassShapeGeometry,
            glassShapeMaterial
          );
          glassShape.rotation.x = -Math.PI * 0.5;
          glassShape.position.z = capsule.height * 0.25;
          mesh.add(glassShape);

          let mask = new THREE.Mesh(capsule.geometry, this.maskMaterial);
          mesh.add(mask);

          mesh.position.set(capsule.position.x, 0, capsule.position.y);
          mesh.renderOrder = 1;
          mesh.position.y = capsule.borderRadius;
          mesh.scale.setScalar(0);
          capsule.scale = 0;
          this.scene.add(mesh);
          capsule.mesh = mesh;

          if (capsule.timeline) {
            capsule.timeline.clear();
          }

          let timeline = gsap.timeline();
          timeline.to(capsule, {
            scale: 1,
            duration: 0.8,
            ease: "back.out",
            onUpdate: () => {
              mesh.scale.setScalar(capsule.scale);
            },
          });
        },
      }
    );

    createCapsuleMesh();

    window.addEventListener("mousemove", (e) => {
      capsule.pointer.x = e.clientX - this.sizes.width * 0.5;
      capsule.pointer.y = e.clientY - this.sizes.height * 0.5;
    });

    this.onTick(() => {
      if (!capsule.mesh || capsule.scale < 0.99) {
        return;
      }

      if (this.isMobile || this.isTouchDevice) {
        return;
      }

      let pointerX = capsule.pointer.x;
      let pointerY = capsule.pointer.y;

      let targetY = clamp(pointerY, capsule.limitTop, capsule.limitBottom);

      let returnOffsetX = 400;
      let returnOffsetY = 240;

      if (
        pointerX > capsule.center.x + returnOffsetX ||
        pointerX < capsule.center.x - returnOffsetX ||
        pointerY < capsule.limitTop - returnOffsetY ||
        pointerY > capsule.limitBottom + returnOffsetY
      ) {
        targetY = capsule.center.y;
      }

      // capsule.mesh.position.z = targetY; // Instant update

      capsule.mesh.position.z -= (capsule.mesh.position.z - targetY) * 0.01;
    });

    window.addEventListener("resize", createCapsuleMesh);
  }

  addCardMesh() {
    let cardsContainer = this.references.cards;
    let card = {
      width: 0,
      height: 0,
      scale: 0,
      centerY: 0,
      positionY: -4000,
      geometry: null,
      mesh: null,
      timeline: null,
    };

    let createCardGeometry = (width, height, radius = 16) => {
      let w = width;
      let h = height;
      let r = radius;

      let geometry = new THREE.PlaneGeometry(
        w,
        h,
        Math.floor(w / 4),
        Math.floor(h / 4)
      );
      let positions = geometry.attributes.position;
      let normals = geometry.attributes.normal;

      let center = new THREE.Vector3();
      center.z = -Math.min(w, h) * 1.5;

      for (let i = 0; i < positions.count; i++) {
        let p = new THREE.Vector3(
          positions.getX(i),
          positions.getY(i),
          positions.getZ(i)
        );

        let dX = w * 0.5 - Math.abs(p.x);
        let dY = h * 0.5 - Math.abs(p.y);

        let edge = Math.min(dX, dY);
        if (edge <= r) {
          let l = (r - edge) / r;
          l = Math.pow(l, 5) * r * 8;
          p.z -= l;
        }

        positions.setXYZ(i, ...p.toArray());
        let normal = p.clone().sub(center).normalize();
        normals.setXYZ(i, ...normal.toArray());
      }

      positions.needsUpdate = true;
      geometry.rotateX(-Math.PI * 0.5);

      return geometry;
    };

    let removeCardMesh = () => {
      if (card.mesh) {
        card.mesh.visible = false;
        this.scene.remove(card.mesh);
        card.mesh = null;
      }
    };

    let createCardMesh = debounceWithHooks(
      () => {
        let el = cardsContainer.querySelector(".card-btn");

        let rect = el.getBoundingClientRect();

        card.width = el.offsetWidth + 8;
        card.height = el.offsetHeight + 8;
        card.centerY = rect.top + rect.height * 0.5 - this.sizes.height * 0.5;
      },
      300,
      {
        onComplete: () => {
          removeCardMesh();

          if (this.isMobile) {
            return;
          }

          let geometry = createCardGeometry(card.width, card.height, 32);

          if (card.mesh) {
            card.mesh.visible = false;
            this.scene.remove(card.mesh);
          }

          let mesh = new THREE.Mesh(geometry, this.cardMaterial);

          let mask = new THREE.Mesh(geometry, this.maskMaterial);
          mesh.add(mask);

          mesh.position.y = card.positionY;
          mesh.position.z = card.centerY;
          mesh.scale.setScalar(0);
          mesh.visible = false;
          mesh.renderOrder = 1;
          this.scene.add(mesh);
          card.mesh = mesh;

          if (card.timeline) {
            card.timeline.clear();
            card.timeline = null;
          }

          let cardTl = gsap.timeline().pause();

          cardTl.to(card, {
            scale: 1,
            positionY: 1000,
            duration: 0.4,
            ease: "back.out(1.6)",
            onStart: () => {
              if (card.mesh) card.mesh.visible = true;
            },
            onUpdate: () => {
              if (card.mesh) {
                card.mesh.scale.setScalar(card.scale);
                card.mesh.position.y = card.positionY;
              }
            },
            onReverseComplete: () => {
              if (card.mesh) card.mesh.visible = false;
            },
          });

          card.timeline = cardTl;
        },
      }
    );

    createCardMesh();

    cardsContainer.addEventListener("mouseenter", () => {
      if (card.timeline) card.timeline.play();
    });

    cardsContainer.addEventListener("mouseleave", () => {
      if (card.timeline) card.timeline.reverse();
    });

    window.addEventListener("mousemove", (e) => {
      let px = e.clientX - this.sizes.width * 0.5;
      if (card.mesh) {
        card.mesh.position.x = px;
      }
    });

    window.addEventListener("resize", createCardMesh);
    window.addEventListener("scroll", createCardMesh);
  }

  addMobileBarMesh() {
    let mobileBar = this.references.mobileBar;
    let bar = {
      width: 0,
      height: 0,
      geometry: null,
      mesh: null,
    };

    bar.width = mobileBar.offsetWidth;
    bar.height = mobileBar.offsetHeight;

    let geometry = new THREE.CylinderGeometry(
      bar.height * 0.5,
      bar.height * 0.5,
      bar.width * 1.5,
      32,
      12
    );
    geometry.scale(0.2, 1, 1);
    geometry.rotateZ(Math.PI * 0.5);
    let material = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0.5,
    });
    let mesh = new THREE.Mesh(geometry, this.mobileBarMaterial);
    mesh.visible = this.isMobile;

    bar.mesh = mesh;
    this.mobileBar = bar;

    this.onResize(() => {
      mesh.visible = this.isMobile;
    });

    this.scene.add(mesh);
  }

  addPostprocessing() {
    let renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
      {
        stencilBuffer: true,
      }
    );
    let composer = new EffectComposer(this.renderer, renderTarget);

    let renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);

    let huePass = new ShaderPass(HueSaturationShader);
    huePass.uniforms.hue.value = POSTPROCESSING.hue;
    huePass.uniforms.saturation.value = POSTPROCESSING.saturation;
    composer.addPass(huePass);

    // let ccShader = new ShaderPass(ColorCorrectionShader);
    // console.log(ccShader);
    // ccShader.uniforms.powRGB.value = new THREE.Vector3().setScalar(0.9);
    // composer.addPass(ccShader);

    let smaaPass = new SMAAPass();
    composer.addPass(smaaPass);

    let outputPass = new OutputPass();
    composer.addPass(outputPass);

    this.onTick(() => {
      composer.render();
    });

    let folder = this.panel.addFolder("Postprocessing");
    folder.close();

    folder
      .add(POSTPROCESSING, "hue", 0, Math.PI * 2, 0.01)
      .onChange((value) => {
        huePass.uniforms.hue.value = value;
      });

    folder.add(POSTPROCESSING, "saturation", 0, 1, 0.01).onChange((value) => {
      huePass.uniforms.saturation.value = value;
    });
  }
}
