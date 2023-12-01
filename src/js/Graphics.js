import { PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
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
    this.smaaPass = new SMAAPass(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
    this.smaaPass.enabled = false; // Default off

    // Add effects to composer
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderPass); // Renderer
    this.composer.addPass(this.smaaPass); // Anti-aliasing
    this.composer.addPass(this.outputPass); // Gamma/sRGB correction

    // Add window resize logic
    window.addEventListener('resize', function(e) { this.resize(e); }.bind(this));
    this.resize(); // Run resize immediately
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

  addOrbitControls(position = { x: 0, y: 0, z: 0 }) {
    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.copy(position);
    this.controls.update();
  }
}

export { Graphics };