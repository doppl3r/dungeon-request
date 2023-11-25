import { Euler, Object3D, Quaternion } from 'three';
import { Body as RigidBody, Material } from 'cannon-es';

// A body contains a single 3D object and a single rigid body object
class Body {
  constructor(options) {
    // Set options with default values
    options = Object.assign({
      mass: 1,
      size: { x: 1, y: 1, z: 1 },
      type: 2, // 1 = DYNAMIC, 4 = KINEMATIC, 2 = STATIC
      scale: { x: 1, y: 1, z: 1 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      shape: null
    }, options);

    // Create an empty object
    this.object = new Object3D();

    console.log(options.shape);
    
    // Initialize rigid body description
    this.rigidBody = new RigidBody({
      shape: options.shape,
      mass: options.mass,
      material: new Material({ friction: 0.5, restitution: 0 })
    });

    this.setPosition(options.position);
    this.setRotation(options.rotation);
  }

  addToWorld(world) {
    // Create rigid body in the world
    world.addBody(this.rigidBody);

    // Update 3D object position and rotation (1 = current body position/rotation)
    this.lerp(1);
  }

  addToScene(scene) {
    scene.add(this.object);
  }

  setPosition(position) {
    this.object.position.copy(position);
    this.rigidBody.position.copy(position);
    this.rigidBody.previousPosition.copy(position);
  }

  setRotation(rotation) {
    var quaternion = new Quaternion().setFromEuler(new Euler().setFromVector3(rotation));
    this.object.quaternion.copy(quaternion);
    this.rigidBody.quaternion.copy(quaternion);
    this.rigidBody.previousQuaternion.copy(quaternion);
  }

  lerp(alpha = 0) {
    if (this.rigidBody.type == 2) alpha = 1;

    // Linear interpolation using alpha value
    this.rigidBody.position._x = this.rigidBody.position.x;
    this.rigidBody.position._y = this.rigidBody.position.y;
    this.rigidBody.position._z = this.rigidBody.position.z;
    this.rigidBody.quaternion._x = this.rigidBody.quaternion.x;
    this.rigidBody.quaternion._y = this.rigidBody.quaternion.y;
    this.rigidBody.quaternion._z = this.rigidBody.quaternion.z;
    this.rigidBody.quaternion._w = this.rigidBody.quaternion.w;
    this.object.position.lerpVectors(this.rigidBody.previousPosition, this.rigidBody.position, alpha);
    this.object.quaternion.slerpQuaternions(this.rigidBody.previousQuaternion, this.rigidBody.quaternion, alpha);
  }
}

export { Body };