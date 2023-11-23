import { BoxGeometry, Euler, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { ColliderDesc, RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d';

class Cube extends Mesh {
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
            color: '#ffffff',
            scene: null,
            world: null
        }, options);

        // Initialize default cube mesh
        this.geometry = new BoxGeometry(options.size.x, options.size.y, options.size.z);
        this.material = new MeshStandardMaterial({ color: options.color });
        this.receiveShadow = true;
        this.castShadow = true;

        // Configure physical body
        this.bodyDesc = new RigidBodyDesc(RigidBodyType[options.type]);
        this.bodyDesc.setTranslation(options.position.x, options.position.y, options.position.z);
        this.bodyDesc.setRotation(new Quaternion().setFromEuler(new Euler().setFromVector3(options.rotation)));
        this.body = options.world.createRigidBody(this.bodyDesc);
        this.colliderDesc = ColliderDesc.cuboid(options.size.x / 2, options.size.y / 2, options.size.z / 2);
        this.collider = options.world.createCollider(this.colliderDesc, this.body);

        // Update mesh position and rotation
        this.position.copy(this.body.translation());
        this.quaternion.copy(this.body.rotation());
        this.snapshot = {
            position: new Vector3(),
            previousPosition: new Vector3(),
            quaternion: new Quaternion(),
            previousQuaternion: new Quaternion()
        }

        // Add self to scene
        options.scene.add(this);
    }

    takeSnapshot() {
        // Store previous position for lerp
        this.snapshot.previousPosition.copy(this.body.translation())
        this.snapshot.previousQuaternion.copy(this.body.rotation())
    }

    lerp(alpha = 0) {
        // Update target position/quaternion to body values
        this.snapshot.position.copy(this.body.translation());
        this.snapshot.quaternion.copy(this.body.rotation());

        // Linear interpolation using alpha value
        this.position.lerpVectors(this.snapshot.previousPosition, this.snapshot.position, alpha);
        this.quaternion.slerpQuaternions(this.snapshot.previousQuaternion, this.snapshot.quaternion, alpha);
    }
}

export { Cube };