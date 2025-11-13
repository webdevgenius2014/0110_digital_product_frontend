import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const DEBUG = true;

export default class Three {
  constructor(domElement) {
    this.domElement = domElement;
    this.setCanvas();

    this.sizes = {};
    this.setSizes();

    this.setCoreElements();

    this.resizeCallbacks = [];
    this.tickCallbacks = [];
    this.addEventListeners();
  }

  setCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = `
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `;
    this.domElement.innerHTML = "";
    this.domElement.appendChild(this.canvas);
  }

  setSizes() {
    this.sizes.width = this.domElement.offsetWidth;
    this.sizes.height = this.domElement.offsetHeight;
    this.sizes.pixelRatio = Math.min(2, window.devicePixelRatio);
  }

  setCoreElements() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(
      -this.sizes.width * 0.5,
      this.sizes.width * 0.5,
      this.sizes.height * 0.5,
      -this.sizes.height * 0.5,
      100,
      7200
    );
    this.camera.position.y = 7000;
    this.camera.lookAt(0, 0, 0);

    if (DEBUG) {
      this.controls = new OrbitControls(this.camera, this.domElement);
      // this.scene.add(new THREE.AxesHelper(1000));
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
      antialias: true,
      stencil: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    this.clock = new THREE.Clock();
  }

  addEventListeners() {
    window.addEventListener("resize", () => {
      this.resize();
    });

    this.animationId = window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  resize() {
    this.setSizes();

    this.camera.left = -this.sizes.width * 0.5;
    this.camera.right = this.sizes.width * 0.5;
    this.camera.top = this.sizes.height * 0.5;
    this.camera.bottom = -this.sizes.height * 0.5;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);

    this.resizeCallbacks.forEach((callback) => {
      callback(this.sizes);
    });
  }

  tick() {
    // Postprocessing will handle the rendering
    this.renderer.render(this.scene, this.camera);

    let elapsed = this.clock.getElapsedTime();
    this.tickCallbacks.forEach((callback) => {
      callback(elapsed);
    });

    if (this.controls) {
      this.controls.update();
    }

    this.animationId = window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  dispose() {
    window.cancelAnimationFrame(this.animationId);
  }

  onResize(callback) {
    this.resizeCallbacks.push(callback);
  }

  onTick(callback) {
    this.tickCallbacks.push(callback);
  }
}
