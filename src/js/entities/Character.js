import { CapsuleGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Capsule } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

/*
  Characters have a single Kinematic Body and a single Character Controller. An
  Enemy or Player should inherit this class for common interface behaviors that
  interact with the world.
*/

class Character extends Entity {
  constructor(options = {}) {
    // Resolve null option values
    if (options.height == null) options.height = 1;
    if (options.radius == null) options.radius = 0.5;
    if (options.type == null) options.type = 'KinematicPositionBased';

    // Create physical shape
    options.shape = new Capsule(options.height / 2, options.radius);

    // Inherit Entity class
    super(options);

    // Initialize default capsule mesh
    var geometry = new CapsuleGeometry(options.radius, options.height);
    var material = new MeshStandardMaterial({ color: options.color });
    var mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.object.add(mesh);
  }

  update(delta) {
    super.update(delta); // Call Entity update function
  }

  addToWorld(world) {
    // Add character shape to the world using Entity addToWorld function
    super.addToWorld(world);

    // Add character controller to the world
    this.controller = world.createCharacterController(0.01); // spacing
    
    // Set slide behavior (up/down)
    this.controller.setSlideEnabled(true);
    this.controller.setMaxSlopeClimbAngle(60 * Math.PI / 180); // angle
    this.controller.setMinSlopeSlideAngle(60 * Math.PI / 180); // angle (30 feels slower up 45deg incline)

    // Set autostep behavior (for stairs)
    this.controller.enableAutostep(0.5, 0.2, true); // maxHeight, minWidth, includeDynamicBodies

    // Set snap behavior when going down a slopwe
    this.controller.enableSnapToGround(0.5); // distance
  }

  removeFromWorld(world) {
    // Remove character shape using Entity removeFromWorld function
    super.removeFromWorld(world);

    // Remove the character controller
    world.removeCharacterController(this.controller);
  }
}

export { Character };