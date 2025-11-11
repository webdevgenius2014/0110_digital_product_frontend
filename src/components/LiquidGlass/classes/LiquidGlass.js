import Three from "./Three";
import { debounceWithHooks } from "./helpers";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial";
import * as THREE from "three";
import * as lil from "three/addons/libs/lil-gui.module.min.js";
import html2canvas from "html2canvas-pro";

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

    this.addTexturePlane();
    this.captureScreen();

    this.setMaterial();
    this.addMesh();

    this.setPanel();
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
  }

  addMesh() {
    let geometry = new THREE.CapsuleGeometry(100, 280, 16, 24, 1);
    geometry.scale(1.4, 1, 1);
    geometry.rotateX(-Math.PI * 0.5);
    geometry.rotateY(-Math.PI * 0.5);
    let mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.y = 100;
    this.scene.add(mesh);

    window.addEventListener("mousemove", (e) => {
      let x = e.clientX - this.sizes.width * 0.5;
      let z = e.clientY - this.sizes.height * 0.5;
      mesh.position.set(x, 100, z);
    });
  }

  setPanel() {
    this.panel = new lil.GUI();

    this.panel.add(PARAMS, "roughness", 0, 1, 0.01).onChange((value) => {
      this.material.roughness = value;
    });

    this.panel.add(PARAMS, "metalness", 0, 1, 0.01).onChange((value) => {
      this.material.metalness = value;
    });

    this.panel.add(PARAMS, "clearcoat", 0, 1, 0.01).onChange((value) => {
      this.material.clearcoat = value;
    });

    this.panel
      .add(PARAMS, "clearcoatRoughness", 0, 1, 0.01)
      .onChange((value) => {
        this.material.clearcoatRoughness = value;
      });

    this.panel.add(PARAMS, "ior", 1, 2.3, 0.01).onChange((value) => {
      this.material.ior = value;
    });

    this.panel.add(PARAMS, "iridescence", 0, 1, 0.01).onChange((value) => {
      this.material.iridescence = value;
    });

    this.panel.add(PARAMS, "iridescenceIOR", 1, 2.3, 0.01).onChange((value) => {
      this.material.iridescenceIOR = value;
    });

    this.panel.add(PARAMS, "thickness", 0, 200, 1).onChange((value) => {
      this.material.thickness = value;
    });

    this.panel
      .add(PARAMS, "chromaticAberration", 0, 1, 0.01)
      .onChange((value) => {
        this.material.chromaticAberration = value;
      });

    this.panel
      .add(PARAMS, "anisotrophicBlur", 0, 10, 0.01)
      .onChange((value) => {
        this.material.anisotrophicBlur = value;
      });

    this.panel.add(PARAMS, "distortion", 0, 10, 0.01).onChange((value) => {
      this.material.distortion = value;
    });

    this.panel.add(PARAMS, "distortionScale", 0, 1, 0.01).onChange((value) => {
      this.material.distortionScale = value;
    });

    this.panel
      .add(PARAMS, "temporalDistortion", 0, 1, 0.01)
      .onChange((value) => {
        this.material.temporalDistortion = value;
      });
  }
}
