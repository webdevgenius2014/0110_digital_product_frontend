import Three from "./Three";
import { debounceWithHooks } from "./helpers";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial";
import * as THREE from "three";
import * as lil from "three/addons/libs/lil-gui.module.min.js";
import html2canvas from "html2canvas-pro";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

const PARAMS = {
  // Physical Material
  roughness: 0,
  metalness: 0,
  clearcoat: 0.4,
  clearcoatRoughness: 0.05,
  ior: 2.3,
  iridescence: 1,
  iridescenceIOR: 2.3,
  thickness: 60,
  backsideThickness: 2,
  reflectivity: 0.1,

  // Transition Material
  chromaticAberration: 0.1,
  anisotrophicBlur: 0.0,
  distortion: 0,
  distortionScale: 0.5,
  temporalDistortion: 0,
};

export default class LiquidGlassMeshes extends Three {
  constructor(domElement) {
    super(domElement);

    this.setPanel();
    this.addTexturePlane();
    this.captureScreen();
    this.setMaterial();
    this.setMaskMaterial();
    this.addCapsuleMesh();
    this.addCardMesh();
  }

  setPanel() {
    this.panel = new lil.GUI();
    this.panel.close();
  }

  addTexturePlane() {
    let geometry = new THREE.PlaneGeometry(1, 1);
    geometry.rotateX(-Math.PI * 0.5);
    let material = new THREE.MeshBasicMaterial({
      // color: 0xff0000,
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
    // mesh.visible = false;

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

  setMaterial() {
    let material = Object.assign(new MeshTransmissionMaterial(24), {
      roughness: PARAMS.roughness,
      metalness: PARAMS.metalness,
      clearcoat: PARAMS.clearcoat,
      clearcoatRoughness: PARAMS.clearcoatRoughness,
      ior: PARAMS.ior,
      iridescence: PARAMS.iridescence,
      iridescenceIOR: PARAMS.iridescenceIOR,
      thickness: PARAMS.thickness,
      backsideThickness: PARAMS.backsideThickness,
      reflectivity: PARAMS.reflectivity,

      chromaticAberration: PARAMS.chromaticAberration,
      anisotrophicBlur: PARAMS.anisotrophicBlur,
      anisotrophicBlur: PARAMS.anisotrophicBlur,
      distortion: PARAMS.distortion,
      distortionScale: PARAMS.distortionScale,
      temporalDistortion: PARAMS.temporalDistortion,

      transmission: 1,

      iridescenceThicknessRange: [0, 140],
    });

    this.material = material;

    let panelFolder = this.panel.addFolder("Material");

    panelFolder.add(PARAMS, "roughness", 0, 1, 0.01).onChange((value) => {
      this.material.roughness = value;
    });

    panelFolder.add(PARAMS, "metalness", 0, 1, 0.01).onChange((value) => {
      this.material.metalness = value;
    });

    panelFolder.add(PARAMS, "clearcoat", 0, 1, 0.01).onChange((value) => {
      this.material.clearcoat = value;
    });

    panelFolder
      .add(PARAMS, "clearcoatRoughness", 0, 1, 0.01)
      .onChange((value) => {
        this.material.clearcoatRoughness = value;
      });

    panelFolder.add(PARAMS, "ior", 1, 2.3, 0.01).onChange((value) => {
      this.material.ior = value;
    });

    panelFolder.add(PARAMS, "iridescence", 0, 1, 0.01).onChange((value) => {
      this.material.iridescence = value;
    });

    panelFolder
      .add(PARAMS, "iridescenceIOR", 1, 2.3, 0.01)
      .onChange((value) => {
        this.material.iridescenceIOR = value;
      });

    panelFolder.add(PARAMS, "thickness", 0, 1000, 1).onChange((value) => {
      this.material.thickness = value;
    });

    panelFolder
      .add(PARAMS, "backsideThickness", 0, 1000, 1)
      .onChange((value) => {
        this.material.backsideThickness = value;
      });

    panelFolder.add(PARAMS, "reflectivity", 0, 1, 0.01).onChange((value) => {
      this.material.reflectivity = value;
    });

    panelFolder
      .add(PARAMS, "chromaticAberration", 0, 2, 0.01)
      .onChange((value) => {
        this.material.chromaticAberration = value;
      });

    panelFolder
      .add(PARAMS, "anisotrophicBlur", 0, 10, 0.01)
      .onChange((value) => {
        this.material.anisotrophicBlur = value;
      });

    panelFolder.add(PARAMS, "distortion", 0, 10, 0.01).onChange((value) => {
      this.material.distortion = value;
    });

    panelFolder.add(PARAMS, "distortionScale", 0, 1, 0.01).onChange((value) => {
      this.material.distortionScale = value;
    });

    panelFolder
      .add(PARAMS, "temporalDistortion", 0, 1, 0.01)
      .onChange((value) => {
        this.material.temporalDistortion = value;
      });
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

          let mesh = new THREE.Mesh(capsule.geometry, this.material);
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

      capsule.position.x += (target.x - capsule.position.x) * 0.01;
      capsule.position.y += (target.y - capsule.position.y) * 0.01;

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

          let geometry = new RoundedBoxGeometry(
            card.width,
            320,
            card.height,
            3,
            16
          );

          if (card.mesh) {
            card.mesh.visible = false;
            card.material.dispose();
            this.scene.remove(card.mesh);
          }

          let material = this.material.clone();
          material.thickness = 40;
          material.chromaticAberration = 1.5;
          material.reflectivity = 0.5;
          material.ior = 2.3;

          let mesh = new THREE.Mesh(geometry, material);
          let mask = new THREE.Mesh(geometry, this.maskMaterial);
          mesh.add(mask);

          mesh.position.y = -100;
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
            duration: 0.8,
            ease: "back.out(2)",
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
}
