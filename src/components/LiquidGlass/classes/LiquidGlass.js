import Three from "./Three";
import { debounceWithHooks } from "./helpers";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial";
import * as THREE from "three";
import * as lil from "three/addons/libs/lil-gui.module.min.js";
import html2canvas from "html2canvas-pro";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";

const PARAMS = {
  // Physical Material
  roughness: 0.01,
  metalness: 0,
  clearcoat: 0.4,
  clearcoatRoughness: 0.05,
  ior: 1.8,
  iridescence: 0,
  iridescenceIOR: 0,
  thickness: 50,

  // Transition Material
  chromaticAberration: 0.05,
  anisotrophicBlur: 0.1,
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
    this.addCapsuleMesh();
  }

  setPanel() {
    this.panel = new lil.GUI();
    this.panel.close();
  }

  addTexturePlane() {
    let geometry = new THREE.PlaneGeometry(1, 1);
    geometry.rotateX(-Math.PI * 0.5);
    let material = new THREE.MeshBasicMaterial();
    let mesh = new THREE.Mesh(geometry, material);
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
      40,
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
    let material = Object.assign(new MeshTransmissionMaterial(8), {
      roughness: PARAMS.roughness,
      metalness: PARAMS.metalness,
      clearcoat: PARAMS.clearcoat,
      clearcoatRoughness: PARAMS.clearcoatRoughness,
      ior: PARAMS.ior,
      iridescence: PARAMS.iridescence,
      iridescenceIOR: PARAMS.iridescenceIOR,
      thickness: PARAMS.thickness,
      reflectivity: 0.2,

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

    panelFolder.add(PARAMS, "thickness", 0, 200, 1).onChange((value) => {
      this.material.thickness = value;
    });

    panelFolder
      .add(PARAMS, "chromaticAberration", 0, 1, 0.01)
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

  addCapsuleMesh() {
    let logo = document.getElementById("hero-section-logo");
    let offset = 32;
    let capsule = {
      width: 0,
      height: 0,
      center: new THREE.Vector2(),
      pointer: new THREE.Vector2(),
      position: new THREE.Vector2(),
      range: 320,
    };

    let setCapsuleSizes = () => {
      let rect = logo.getBoundingClientRect();

      capsule.width = logo.offsetWidth + offset;
      capsule.height = logo.offsetHeight * 1.2 + offset;

      capsule.center.x = rect.left + rect.width * 0.5 - this.sizes.width * 0.5;
      capsule.center.y = rect.top + rect.height * 0.5 - this.sizes.height * 0.5;

      capsule.position.copy(capsule.center);
    };
    setCapsuleSizes();

    let borderRadius = Math.min(capsule.width, capsule.height);

    let geometry = new RoundedBoxGeometry(
      capsule.width,
      borderRadius,
      capsule.height,
      8,
      borderRadius
    );

    let debugMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
    let mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(capsule.position.x, 0, capsule.position.y);
    mesh.scale.y = 0.8;
    this.scene.add(mesh);

    window.addEventListener("mousemove", (e) => {
      capsule.pointer.x = e.clientX - this.sizes.width * 0.5;
      capsule.pointer.y = e.clientY - this.sizes.height * 0.5;
    });

    this.onTick(() => {
      let distance = capsule.center.distanceTo(capsule.pointer);
      let target = distance <= capsule.range ? capsule.pointer : capsule.center;

      capsule.position.x += (target.x - capsule.position.x) * 0.04;
      capsule.position.y += (target.y - capsule.position.y) * 0.04;

      mesh.position.x = capsule.position.x;
      mesh.position.z = capsule.position.y;
    });
  }
}
