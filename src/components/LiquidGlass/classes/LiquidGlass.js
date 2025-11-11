import Three from "./Three";
import { debounceWithHooks } from "./helpers";
import * as THREE from "three";
import html2canvas from "html2canvas-pro";

export default class LiquidGlassMeshes extends Three {
  constructor(domElement) {
    super(domElement);

    this.addTexturePlane();
    this.captureScreen();
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
}
