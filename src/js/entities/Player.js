import { Vector3 } from 'three';
import { Character } from './Character.js';

/*
  A Player is a singleton class that allows players to control a character
  entity. The controls include keyboard and mouse (pointer) input.
*/

class Player extends Character {
  constructor(options = {}) {
    // Inherit Character class
    super(options);

    // Initialize default values
    this.keys = {};
    this.velocity = new Vector3();
    this.next = new Vector3();
  }

  update(delta) {
    super.update(delta); // Call Character update function

    // Copy current position
    this.next.copy(this.rigidBody.translation());

    // Set vertical velocity to zero if grounded
    if (this.controller.computedGrounded() == true) this.velocity.y = 0;

    // Increase velocity from gravity
    this.velocity.y -= delta;

    // Add player directional input
    if (this.keys['KeyW'] == true) this.velocity.z -= delta * 10;
    if (this.keys['KeyS'] == true) this.velocity.z += delta * 10;
    if (this.keys['KeyA'] == true) this.velocity.x -= delta * 10;
    if (this.keys['KeyD'] == true) this.velocity.x += delta * 10;

    // Simulate constant movement damping
    this.velocity.z *= 0.5;
    this.velocity.x *= 0.5;

    // Calculate collider movement
    this.controller.computeColliderMovement(this.collider, this.velocity);

    // Calculate next movement
    this.movement = this.controller.computedMovement();
    this.next.add(this.movement);
    this.rigidBody.setNextKinematicTranslation(this.next);
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