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

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass } from "three/examples/jsm/Addons.js";

const CAPSULE_PARAMS = {
  // Physical Material
  roughness: 0,
  metalness: 0,
  clearcoat: 0.4,
  clearcoatRoughness: 0.05,
  ior: 2.3,
  iridescence: 1,
  iridescenceIOR: 2.3,
  thickness: 80,
  backsideThickness: 30,
  reflectivity: 0.15,

  // Transition Material
  chromaticAberration: 0.01,
  anisotrophicBlur: 0.0,
  distortion: 0,
  distortionScale: 0.0,
  temporalDistortion: 0,
};

const CARD_PARAMS = {
  // Physical Material
  roughness: 0,
  metalness: 0.08,
  clearcoat: 0.4,
  clearcoatRoughness: 0.05,
  ior: 1.4,
  iridescence: 1,
  iridescenceIOR: 1.4,
  thickness: 40,
  backsideThickness: 70,
  reflectivity: 0.3,

  // Transition Material
  chromaticAberration: 0.4,
  anisotrophicBlur: 0.02,
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

    this.setPanel();
    this.addTexturePlane();
    this.captureScreen();
    this.loadTextures();

    this.capsuleMaterial = this.createMaterial("Capsule", CAPSULE_PARAMS);
    this.cardMaterial = this.createMaterial("Card", CARD_PARAMS);

    this.setMaskMaterial();

    this.addCapsuleMesh();
    this.addCardMesh();

    this.addPostprocessing();
  }

  setPanel() {
    this.panel = new lil.GUI();
    this.panel.close();
  }

  addTexturePlane() {
    let geometry = new THREE.PlaneGeometry(1, 1);
    geometry.rotateX(-Math.PI * 0.5);
    let material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1, 1, 1).multiplyScalar(1.2),
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
      mesh.scale.set(sizes.width, 1, sizes.height);
    });

    this.scene.add(mesh);
    this.texturePlane = mesh;
  }

  captureScreen() {
    let texture;
    let updateTexture = debounceWithHooks(
      () => {
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
          this.texturePlane.material.map = texture;
          this.texturePlane.material.needsUpdate = true;
          // this.scene.background = texture;
          // this.scene.environment = texture;
        });
      },
      300,
      {
        onStart: () => {},
        onComplete: () => {},
      }
    );
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

  createMaterial(name, parameters) {
    let material = Object.assign(new MeshTransmissionMaterial(24), {
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

  setMaskMaterial() {
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
    let logo = document.getElementById("hero-section-logo");
    let offset = 32;
    let capsule = {
      width: 0,
      height: 0,
      borderRadius: 0,
      center: new THREE.Vector2(),
      pointer: new THREE.Vector2(),
      position: new THREE.Vector2(),
      range: 320,
      geometry: null,
      mesh: null,
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

        capsule.width = logo.offsetWidth + offset;
        capsule.height = logo.offsetHeight * 1.2 + offset;
        capsule.borderRadius = Math.min(capsule.width, capsule.height);

        capsule.center.x =
          rect.left + rect.width * 0.5 - this.sizes.width * 0.5;
        capsule.center.y =
          rect.top + rect.height * 0.5 - this.sizes.height * 0.5;

        capsule.position.copy(capsule.center);
      },
      300,
      {
        onComplete: () => {
          removeCapsuleMesh();

          if (this.sizes.width < 1024) {
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
            // color: 0xff0000,
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
          // mesh.scale.y =  capsule.borderRadius;
          mesh.position.y = capsule.borderRadius;
          this.scene.add(mesh);
          capsule.mesh = mesh;
        },
      }
    );

    createCapsuleMesh();

    window.addEventListener("mousemove", (e) => {
      capsule.pointer.x = e.clientX - this.sizes.width * 0.5;
      capsule.pointer.y = e.clientY - this.sizes.height * 0.5;
    });

    this.onTick(() => {
      if (!capsule.mesh) {
        return;
      }

      let distance = capsule.center.distanceTo(capsule.pointer);
      let target = distance <= capsule.range ? capsule.pointer : capsule.center;

      capsule.position.x += (target.x - capsule.position.x) * 0.02;
      capsule.position.y += (target.y - capsule.position.y) * 0.02;

      capsule.mesh.position.x = capsule.position.x;
      capsule.mesh.position.z = capsule.position.y;
    });

    window.addEventListener("resize", createCapsuleMesh);
    window.addEventListener("scroll", createCapsuleMesh);
  }

  addCardMesh() {
    let cardsContainer = document.getElementById("what-we-do-cards");
    let card = {
      width: 0,
      height: 0,
      scale: 0,
      centerY: 0,
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
        Math.floor(w / 8),
        Math.floor(h / 8)
      );
      let positions = geometry.attributes.position;
      let normals = geometry.attributes.normal;

      let center = new THREE.Vector3();
      center.z = -Math.min(w, h) * 1;

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
          l = Math.pow(l, 3) * r;

          p.z += l;
        }

        positions.setXYZ(i, ...p.toArray());

        let normal = p.clone().sub(center).normalize();
        normals.setXYZ(i, ...normal.toArray());
      }

      positions.needsUpdate = true;
      geometry.rotateX(-Math.PI * 0.5);
      // geometry.rotateY(-Math.PI * 0.2);

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
        onStart: () => {},
        onComplete: () => {
          removeCardMesh();

          if (this.sizes.width < 1024) {
            return;
          }

          // let geometry = new RoundedBoxGeometry(
          //   card.width,
          //   320,
          //   card.height,
          //   8,
          //   20
          // );

          let geometry = createCardGeometry(card.width, card.height, 32);

          if (card.mesh) {
            card.mesh.visible = false;
            this.scene.remove(card.mesh);
          }

          let mesh = new THREE.Mesh(geometry, this.cardMaterial);
          // let mesh = new THREE.Mesh(
          //   geometry,
          //   new THREE.MeshNormalMaterial({ wireframe: true })
          // );

          let mask = new THREE.Mesh(geometry, this.maskMaterial);
          mesh.add(mask);

          mesh.position.y = 50;
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
            duration: 0.4,
            ease: "back.out(1.6)",
            onStart: () => {
              card.mesh.visible = true;
            },
            onUpdate: () => {
              card.mesh.scale.setScalar(card.scale);
            },
            onReverseComplete: () => {
              card.mesh.visible = false;
            },
          });

          card.timeline = cardTl;
          // cardTl.play();
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
