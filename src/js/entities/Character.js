import { Vector3 } from 'three';
import { Capsule } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

/*
  Characters have a single Kinematic Body and a single Character Controller. An
  Enemy or Player should inherit this class for common control behaviors that
  interact with the world.
*/

class Character extends Entity {
  constructor(options = {}) {
    // Resolve null option values
    if (options.color == null) options.color = '#ffffff';
    if (options.height == null) options.height = 1;
    if (options.radius == null) options.radius = 0.5;
    if (options.type == null) options.type = 'KinematicPositionBased';

    // Create physical shape
    options.shape = new Capsule(options.height / 2, options.radius);

    // Inherit Entity class
    super(options);

    // Set default values
    this.actions = {};
    this.isJumping = true;
    this.isGrounded = false;
    this.speed = 5;
    this.velocity = new Vector3();
    this.movement = new Vector3();
    this.direction = new Vector3();
    this.nextTranslation = new Vector3();
  }

  update(delta) {
    // Copy current position into next position
    this.nextTranslation.copy(this.rigidBody.translation());

    // Check if the controller is grounded
    this.isGrounded = this.controller.computedGrounded();

    // Set vertical velocity to zero if grounded
    if (this.isGrounded == true) {
      this.velocity.y = 0;
      this.isJumping = false;
    }

    // Increase velocity from gravity
    this.velocity.y -= delta;

    // Update velocity from actions
    if (this.actions['moveUp'] == true) this.velocity.z -= delta * this.speed;
    if (this.actions['moveDown'] == true) this.velocity.z += delta * this.speed;
    if (this.actions['moveLeft'] == true) this.velocity.x -= delta * this.speed;
    if (this.actions['moveRight'] == true) this.velocity.x += delta * this.speed;
    if (this.actions['jump'] == true && this.isJumping == false) {
      this.isJumping = true;
      this.velocity.y += 0.3334;
    }
    
    // Simulate constant movement damping
    this.velocity.z *= 0.5;
    this.velocity.x *= 0.5;

    // Clamp directional velocity
    this.direction.x =  this.velocity.x;
    this.direction.z =  this.velocity.z;
    if (this.direction.length() / delta > this.speed) {
      this.direction.clampLength(-this.speed * delta, this.speed * delta);
      this.velocity.x = this.direction.x;
      this.velocity.z = this.direction.z;
    }

    // Calculate collider movement
    this.controller.computeColliderMovement(this.collider, this.velocity);

    // Resolve collision issues
    for (var i = 0; i < this.controller.numComputedCollisions(); i++) {
      var collision = this.controller.computedCollision(i);

      // Reflect velocity if hitting head on top
      if (collision.normal1.y == -1) {
        this.velocity.reflect(collision.normal1);
        //console.log(collision);
      }
    }

    // Calculate next movement
    this.movement.copy(this.controller.computedMovement());
    this.nextTranslation.add(this.movement);
    this.rigidBody.setNextKinematicTranslation(this.nextTranslation);

    // Call Entity update function
    super.update(delta);
  }

  addToWorld(world) {
    // Add character shape to the world using Entity addToWorld function
    super.addToWorld(world);

    // Add character controller to the world
    this.controller = world.createCharacterController(0.01); // spacing
    
    // Set controller behavior
    this.controller.setSlideEnabled(true); // Allow sliding down hill
    this.controller.setMaxSlopeClimbAngle(60 * Math.PI / 180); // (angle) Limit uphill climbing
    this.controller.setMinSlopeSlideAngle(60 * Math.PI / 180); // (angle) 30 feels slower up 45deg incline
    this.controller.enableAutostep(0.5, 0.2, true); // (maxHeight, minWidth, includeDynamicBodies) Stair behavior
    this.controller.enableSnapToGround(0.5); // (distance) Set ground snap behavior
    this.controller.setApplyImpulsesToDynamicBodies(true); // Add push behavior
    this.controller.setCharacterMass(1); // (mass) Set character mass
  }

  removeFromWorld(world) {
    // Remove character shape using Entity removeFromWorld function
    super.removeFromWorld(world);

    // Remove the character controller
    world.removeCharacterController(this.controller);
  }
}

export { Character };