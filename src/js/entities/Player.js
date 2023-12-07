import { CapsuleGeometry, Mesh, MeshStandardMaterial, PerspectiveCamera, Vector3 } from 'three';
import { Character } from './Character.js';

/*
  A Player is a singleton class that allows players to control a character
  entity. The controls include keyboard and mouse (pointer) input.
*/

class Player extends Character {
  constructor(options = {}) {
    // Inherit Character class
    super(options);

    // Initialize input keys
    this.keys = {};

    // Initialize default capsule mesh
    var geometry = new CapsuleGeometry(options.radius, options.height);
    var material = new MeshStandardMaterial({ color: options.color });
    var mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.object.add(mesh);

    // Add camera
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
    this.camera.position.set(0, 4, 4);
    this.camera.lookAt(0, 0, 0);
    this.object.add(this.camera);
  }

  update(delta) {
    super.update(delta); // Call Character update function

    // Update character actions from key input
    this.actions['moveUp'] = (this.keys['KeyW'] == true);
    this.actions['moveDown'] = (this.keys['KeyS'] == true);
    this.actions['moveLeft'] = (this.keys['KeyA'] == true);
    this.actions['moveRight'] = (this.keys['KeyD'] == true);
    this.actions['jump'] = (this.keys['Space'] == true);
  }

  addEventListeners(domElement) {
    // Set null element to document
    var doc = (domElement == null) ? window.document : domElement.ownerDocument;

    // Add event listeners
    doc.addEventListener('pointerdown', function(e) { this.pointerDown(e); }.bind(this), false);
    doc.addEventListener('pointermove', function(e) { this.pointerMove(e); }.bind(this), false);
    doc.addEventListener('pointerup', function(e) { this.pointerUp(e); }.bind(this), false);
    doc.addEventListener('keydown', function(e) { this.keyDown(e); }.bind(this), false);
    doc.addEventListener('keyup', function(e) { this.keyUp(e); }.bind(this), false);
  }

  pointerDown(e) {
    
  }

  pointerMove(e) {
    
  }

  pointerUp(e) {
    
  }

  keyDown(e) {
    if (e.repeat) return;
    this.keys[e.code] = true;
  }

  keyUp(e) {
    this.keys[e.code] = false;
  }
}

export { Player };