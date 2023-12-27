import { PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Graphics {
  constructor(canvas) {
    // Initialize camera and scene
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
    this.scene = new Scene();
    this.canvas = canvas;

    // Initialize renderer components
    this.renderer = new WebGLRenderer({ alpha: true, canvas: canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    // Assign post processing on top of renderer
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.outputPass = new OutputPass(); // {} = use default resolution

    // Initialize (optional) effects
    this.outlinePass = new OutlinePass({ x: window.innerWidth, y: window.innerHeight }, this.scene, this.camera);
    this.outlinePass.edgeStrength = 3; // Default 3
		this.outlinePass.edgeGlow = 0; // Default 0
		this.outlinePass.edgeThickness = 1; // Default 1
    this.outlinePass.enabled = true;
		this.outlinePass.visibleEdgeColor.set('#000000');
		this.outlinePass.hiddenEdgeColor.set('#ffffff');
    this.smaaPass = new SMAAPass(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    this.smaaPass.enabled = true;

    // Add effects to composer
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderPass); // Renderer
    this.composer.addPass(this.outlinePass); // Outline
    this.composer.addPass(this.smaaPass); // Anti-aliasing
    this.composer.addPass(this.outputPass); // Gamma/sRGB correction

    // Add window resize logic
    window.addEventListener('resize', function(e) { this.resize(e); }.bind(this));
    this.resize(); // Run resize immediately
    this.setTick(60);
  }

  setTick(tick = 60) {
    this.tick = tick;
  }

  update(delta) {
    if (this.controls) this.controls.update(delta);
    this.render();
  }

  render() {
    this.composer.render();
  }

  resize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.setSize(width, height);
  }

  setSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  setCamera(camera) {
    this.camera = camera;
    this.renderPass.camera = camera;
    this.outlinePass.renderCamera = camera;
  }

  setScene(scene) {
    this.scene = scene;
    this.renderPass.scene = scene;
    this.outlinePass.renderScene = scene;
  }

  setShadows(state = true) {
    this.renderer.shadowMap.enabled = state;
    this.scene.traverse(function (child) {
      if (child.material) {
        child.castShadow = state;
        child.receiveShadow = state;
        child.material.needsUpdate = true;
      }
    });
  }

  setSelectedObjects(objects = []) {
    // Set outline selected objects
		this.outlinePass.selectedObjects = objects;
  }

  addOrbitControls(position = { x: 0, y: 0, z: 0 }) {
    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.copy(position);
    this.controls.update();
  }
}

export { Graphics };