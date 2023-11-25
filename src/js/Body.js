import { Euler, Object3D, Quaternion, Vector3 } from 'three';
import { ColliderDesc, RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d';

// A body contains a single 3D object and a single rigid body object
class Body {
  constructor(options) {
    // Set options with default values
    options = Object.assign({
      mass: 1,
      size: { x: 1, y: 1, z: 1 },
      type: 'Dynamic', // 0: Dynamic, 1: Fixed, 2: KinematicPositionBased, 3: KinematicVelocityBased
      scale: { x: 1, y: 1, z: 1 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      shape: null,
      scene: null,
      world: null
    }, options);

    // Create an empty object
    this.object = new Object3D();

    // Initialize rigid body description
    this.rigidBodyDesc = new RigidBodyDesc(RigidBodyType[options.type]);
    this.rigidBodyDesc.setTranslation(options.position.x, options.position.y, options.position.z);
    this.rigidBodyDesc.setRotation(new Quaternion().setFromEuler(new Euler().setFromVector3(options.rotation)));
    
    // Initialize collider description
    this.colliderDesc = new ColliderDesc(options.shape);
  }

  addToWorld(world) {
    // Create rigid body in the world
    this.rigidBody = world.createRigidBody(this.rigidBodyDesc);
    this.collider = world.createCollider(this.colliderDesc, this.rigidBody); // Parent collision to rigid body

    // Update 3D object position and rotation (1 = current body position/rotation)
    this.lerp(1);
  }

  addToScene(scene) {
    scene.add(this.object);
  }

  takeSnapshot() {
    // Store previous position for lerp
    this.snapshot.position_1.copy(this.rigidBody.translation());
    this.snapshot.quaternion_1.copy(this.rigidBody.rotation());
  }

  lerp(alpha = 0) {
    // Create initial snapshot
    if (this.snapshot == null) {
      this.snapshot = {
        position_1: new Vector3(),
        position_2: new Vector3(),
        quaternion_1: new Quaternion(),
        quaternion_2: new Quaternion(),
      }
    }

    // Skip lerp if body type == 1 "Fixed"
    if (this.rigidBodyDesc.status == 1) alpha = 1;

    // Update target position/quaternion to body values
    this.snapshot.position_2.copy(this.rigidBody.translation());
    this.snapshot.quaternion_2.copy(this.rigidBody.rotation());

    // Linear interpolation using alpha value
    this.object.position.lerpVectors(this.snapshot.position_1, this.snapshot.position_2, alpha);
    this.object.quaternion.slerpQuaternions(this.snapshot.quaternion_1, this.snapshot.quaternion_2, alpha);
  }
}

export { Body };