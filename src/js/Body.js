import { Euler, Mesh, Quaternion, Vector3 } from 'three';
import { ColliderDesc, Cuboid, RigidBodyDesc, RigidBodyType, Shape } from '@dimforge/rapier3d';

// A body contains a single 3D mesh and a single physical body object
class Body extends Mesh {
    constructor(options) {
        super();

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

        // Configure physical body
        this.bodyDesc = new RigidBodyDesc(RigidBodyType[options.type]);
        this.setPosition(options.position);
        this.setRotation(options.rotation);
        this.body = options.world.createRigidBody(this.bodyDesc);
        
        // Create collider within the world using the body
        this.colliderDesc = new ColliderDesc(options.shape);
        try { options.world.createCollider(this.colliderDesc, this.body); }
        catch { console.error('Error: Shape must be defined.'); }

        // Update mesh position and rotation (1 = current body position/rotation)
        this.lerp(1);

        // Add self to scene
        options.scene.add(this);
    }

    setPosition(position) {
        this.bodyDesc.setTranslation(position.x, position.y, position.z)
    }

    setRotation(rotation) {
        this.bodyDesc.setRotation(new Quaternion().setFromEuler(new Euler().setFromVector3(rotation)));
    }

    takeSnapshot() {
        // Store previous position for lerp
        this.snapshot.position_1.copy(this.body.translation())
        this.snapshot.quaternion_1.copy(this.body.rotation())
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

        // Update target position/quaternion to body values
        this.snapshot.position_2.copy(this.body.translation());
        this.snapshot.quaternion_2.copy(this.body.rotation());

        // Linear interpolation using alpha value
        this.position.lerpVectors(this.snapshot.position_1, this.snapshot.position_2, alpha);
        this.quaternion.slerpQuaternions(this.snapshot.quaternion_1, this.snapshot.quaternion_2, alpha);
    }
}

export { Body };