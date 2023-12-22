import { Euler, Object3D, Quaternion, Vector3 } from 'three';
import { ColliderDesc, RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d';

/*
  An entity contains a single 3D object and a single rigid body object. An entity
  assumes that the rigid body is being updated at a lower interval, and leverages
  the lerp() function to up the 3D object at a higher interval (smoother results)
*/

class Entity {
  constructor(options) {
    // Set options with default values
    options = Object.assign({
      mass: 1,
      size: { x: 1, y: 1, z: 1 },
      type: 'Dynamic', // 0: Dynamic, 1: Fixed, 2: KinematicPositionBased, 3: KinematicVelocityBased
      scale: { x: 1, y: 1, z: 1 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      isSensor: false,
      shape: null
    }, options);

    // Create an empty object
    this.object = new Object3D();
    this.offset = new Vector3();

    // Initialize rigid body description
    this.rigidBodyDesc = new RigidBodyDesc(RigidBodyType[options.type]);
    this.rigidBodyDesc.setTranslation(options.position.x, options.position.y, options.position.z);
    this.rigidBodyDesc.setRotation(new Quaternion().setFromEuler(new Euler().setFromVector3(options.rotation)));
    
    // Initialize collider description
    this.colliderDesc = new ColliderDesc(options.shape);
    this.colliderDesc.setSensor(options.isSensor);
  }

  updateBody(delta) {
    // Take a snapshot every time the entity is updated
    this.takeSnapshot();
  }

  updateObject(delta, alpha) {
    // Animate (if mixer exists)
    if (this.object.mixer) {
      this.object.mixer.update(delta);
    }

    // Interpolate 3D object position
    this.lerp(alpha)
  }

  addToWorld(world) {
    // Create rigid body in the world
    this.rigidBody = world.createRigidBody(this.rigidBodyDesc);
    this.collider = world.createCollider(this.colliderDesc, this.rigidBody); // Parent collision to rigid body

    // Update default 3D object position and rotation
    this.object.position.copy(this.rigidBody.translation());
    this.object.quaternion.copy(this.rigidBody.rotation());

    // Prepare initial snapshot from rigid body
    this.takeSnapshot();
  }

  removeFromWorld(world) {
    world.removeRigidBody(this.rigidBody); // Includes colliders that were attached
  }

  addToScene(scene) {
    scene.add(this.object);
  }

  removeFromScene(scene) {
    scene.remove(this.object);
  }

  setNextPosition(position) {
    this.rigidBody.setNextKinematicTranslation(position, true); // Wake
  }

  takeSnapshot() {
    // Get position/rotation
    var position = this.rigidBody.translation();
    var rotation = this.rigidBody.rotation();

    // Create initial snapshot
    if (this.snapshot == null) {
      this.snapshot = {
        position_1: new Vector3().copy(position), // Previous position
        position_2: new Vector3().copy(position), // Current position
        quaternion_1: new Quaternion().copy(rotation), // Previous rotation
        quaternion_2: new Quaternion().copy(rotation), // Current rotation
      }
    }

    // Store previous position for lerp
    this.snapshot.position_1.copy(this.snapshot.position_2);
    this.snapshot.quaternion_1.copy(this.snapshot.quaternion_2);

    if (this.rigidBody.isKinematic()) {
      // Store next position for lerp - requires setNextKinematicTranslation()
      this.snapshot.position_2.copy(this.rigidBody.nextTranslation());
      this.snapshot.quaternion_2.copy(this.rigidBody.nextRotation());
    }
    else {
      // Store next position for lerp
      this.snapshot.position_2.copy(position);
      this.snapshot.quaternion_2.copy(rotation);
    }
  }

  lerp(alpha = 0) {
    // Skip (s)lerp if body type is "Fixed"
    if (this.rigidBody.isFixed()) return false;

    // Linear interpolation using alpha value
    this.object.position.lerpVectors(this.snapshot.position_1, this.snapshot.position_2, alpha);
    this.object.position.add(this.offset); // Adjust offset (optional)
    this.object.quaternion.slerpQuaternions(this.snapshot.quaternion_1, this.snapshot.quaternion_2, alpha);
  }

  toJSON() {
    
  }
}

export { Entity };