import { PerspectiveCamera, Vector3 } from 'three';
import { Character } from './Character.js';

/*
  A Player is a singleton class that allows players to control a character
  entity. The controls include keyboard and mouse (pointer) input.
*/

class Player extends Character {
  constructor(options = {}) {
    // Resolve null option values
    if (options.name == null) options.name = 'player';

    // Inherit Character class
    super(options);

    // Add camera
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
    this.camera.offset = new Vector3(0, 2, 2);
    this.camera.position.add(this.camera.offset);
    this.camera.lookAt(this.object.position);

    // Initialize input keys
    this.keys = {};
  }

  updateBody(delta) {
    // Update character actions from key input
    this.actions['moveUp'] = (this.keys['KeyW'] == true);
    this.actions['moveDown'] = (this.keys['KeyS'] == true);
    this.actions['moveLeft'] = (this.keys['KeyA'] == true);
    this.actions['moveRight'] = (this.keys['KeyD'] == true);
    this.actions['jump'] = (this.keys['Space'] == true);

    // Call Character update function
    super.updateBody(delta);
  }

  updateObject(delta, alpha) {
    // Call Character update function
    super.updateObject(delta, alpha);
    
    // Update camera position
    this.camera.position.copy(this.object.position).add(this.camera.offset);
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

  isMoving() {
    return (this.keys['KeyW'] == true || this.keys['KeyS'] == true || this.keys['KeyA'] == true || this.keys['KeyD'] == true);
  }

  pointerDown(e) {
    
  }

  pointerMove(e) {
    
  }

  pointerUp(e) {
    
  }

  keyDown(e) {
    // Assign key inputs to true (once)
    if (e.repeat) return;
    this.keys[e.code] = true;

    // Update model animations
    if (this.isMoving() == true) {
      this.model.play('Run', 0.125);
    }
  }

  keyUp(e) {
    // Set key values to false
    this.keys[e.code] = false;

    // Update model animations
    if (this.isMoving() == false) {
      this.model.play('Idle', 0.125);
    }
  }
}

export { Player };