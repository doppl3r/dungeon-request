import { PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

class Graphics {
  constructor(canvas) {
    // Initialize camera and scene
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.scene = new Scene();

    // Initialize renderer components
    this.renderer = new WebGLRenderer({ alpha: true, canvas: canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    // Assign post processing on top of renderer
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.outputPass = new OutputPass(); // {} = use default resolution

    // Add effects to composer
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderPass); // Renderer
    this.composer.addPass(this.outputPass); // Gamma correction
  }

  render() {
    this.composer.render();
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
	}
}

export { Graphics };