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
      shape: null,
      model: null
    }, options);

    // Create an empty object
    this.object = new Object3D();

    // Add optional model
    this.addModel(options.model);

    // Initialize rigid body description
    this.rigidBodyDesc = new RigidBodyDesc(RigidBodyType[options.type]);
    this.rigidBodyDesc.setTranslation(options.position.x, options.position.y, options.position.z);
    this.rigidBodyDesc.setRotation(new Quaternion().setFromEuler(new Euler().setFromVector3(options.rotation)));
    
    // Initialize collider description
    this.colliderDesc = new ColliderDesc(options.shape);
    this.colliderDesc.setSensor(options.isSensor);

    // These properties are created by the world
    this.body = null;
    this.collider = null;

    // Initialize default snapshot for object position/rotation (s)lerp
    this.snapshot = {
      position_1: new Vector3().copy(this.rigidBodyDesc.translation), // Previous position
      position_2: new Vector3().copy(this.rigidBodyDesc.translation), // Current position
      quaternion_1: new Quaternion().copy(this.rigidBodyDesc.rotation), // Previous rotation
      quaternion_2: new Quaternion().copy(this.rigidBodyDesc.rotation), // Current rotation
    }
  }

  updateBody(delta) {
    // Take a snapshot every time the entity is updated
    this.takeSnapshot();
  }

  updateObject(delta, alpha) {
    // Update model (optional)
    if (this.model && this.model.mixer) {
      this.model.mixer.update(delta);
    }

    // Interpolate 3D object position
    this.lerp(alpha)
  }

  addToWorld(world) {
    // Create rigid body in the world
    this.body = world.createRigidBody(this.rigidBodyDesc);
    this.collider = world.createCollider(this.colliderDesc, this.body); // Parent collision to rigid body

    // Update default 3D object position and rotation
    this.object.position.copy(this.body.translation());
    this.object.quaternion.copy(this.body.rotation());

    // Take snapshot from rigid body
    this.takeSnapshot();
  }

  removeFromWorld(world) {
    world.removeRigidBody(this.body); // Includes colliders that were attached
  }

  addToScene(scene) {
    scene.add(this.object);
  }

  removeFromScene(scene) {
    scene.remove(this.object);
  }

  setNextPosition(position) {
    if (this.body) this.body.setNextKinematicTranslation(position, true); // true = wake from sleep
    this.snapshot.position_2.copy(position);
  }

  setNextRotation(rotation) { // Type "quaternion"
    if (this.body) this.body.setNextKinematicRotation(rotation, true); // true = wake from sleep
    this.snapshot.quaternion_2.copy(rotation);
  }

  addModel(model) {
    if (model) {
      this.model = model;
      this.model.position.y = -(this.colliderDesc.shape.halfHeight * 2);
      this.object.add(model);
    }
  }

  takeSnapshot() {
    // A snapshot requires a physical rigid body
    if (this.body) {
      // Store previous snapshot position for lerp
      this.snapshot.position_1.copy(this.snapshot.position_2);
      this.snapshot.quaternion_1.copy(this.snapshot.quaternion_2);

      // Store next position for lerp if the rigid body is a kinematic type
      if (this.body.isKinematic()) {
        this.snapshot.position_2.copy(this.body.nextTranslation());
        this.snapshot.quaternion_2.copy(this.body.nextRotation());
      }
      else {
        // Store next position for lerp for all other rigid body types
        this.snapshot.position_2.copy(this.body.translation());
        this.snapshot.quaternion_2.copy(this.body.rotation());
      }
    }
  }

  lerp(alpha = 0) {
    // Skip (s)lerp if body type is null or "Fixed"
    if (this.body && this.body.isFixed()) return false;

    // Linear interpolation using alpha value
    this.object.position.lerpVectors(this.snapshot.position_1, this.snapshot.position_2, alpha);
    this.object.quaternion.slerpQuaternions(this.snapshot.quaternion_1, this.snapshot.quaternion_2, alpha);
  }

  toJSON() {
    var json = {
      object: {
        position: {
          x: this.object.position.x,
          y: this.object.position.y,
          z: this.object.position.z
        },
        quaternion: {
          x: this.object.quaternion.x,
          y: this.object.quaternion.y,
          z: this.object.quaternion.z,
          w: this.object.quaternion.w,
        },
        scale: {
          x: this.object.scale.x,
          y: this.object.scale.y,
          z: this.object.scale.z,
        }
      }
    };

    // Add body info
    if (this.body) {
      json.body = {
        type: this.body.bodyType()
      }
    }

    // Add model info
    if (this.model) {
      json.model = {
        name: this.model.name
      }

      // Add optional actions
      if (this.model.actions) {
        json.model.action = {
          name: this.model.actions.active.getClip().name,
          time: this.model.actions.active.time,
        }
      }
    }

    return json;
  }
}

export { Entity };