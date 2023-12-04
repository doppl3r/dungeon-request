import { Capsule } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

class Character extends Entity {
  constructor(options = {}) {
    // Resolve null option values
    if (options.height == null) options.height = 0.5;
    if (options.radius == null) options.radius = 0.5;
    if (options.type == null) options.type = 'KinematicPositionBased';

    // Create physical shape
    options.shape = new Capsule(options.height / 2, options.radius);

    // Inherit Entity class
    super(options);
  }

  addToWorld(world) {
    // Add character shape to the world using Entity addToWorld function
    super.addToWorld(world);

    // Add character controller to the world
    this.controller = world.createCharacterController(0.01); // spacing
    
    // Set slide behavior (up/down)
    this.controller.setSlideEnabled(true);
    this.controller.setMaxSlopeClimbAngle(45 * Math.PI / 180); // angle
    this.controller.setMinSlopeSlideAngle(30 * Math.PI / 180); // angle

    // Set autostep behavior (for stairs)
    this.controller.enableAutostep(0.5, 0.2, true); // maxHeight, minWidth, includeDynamicBodies

    // Set snap behavior when going down a slope
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