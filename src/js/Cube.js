import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
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
        this.bodyDesc = new RigidBodyDesc(RigidBodyType[options.type]).setTranslation(options.position.x, options.position.y, options.position.z);
        this.body = options.world.createRigidBody(this.bodyDesc);
        this.colliderDesc = ColliderDesc.cuboid(options.size.x / 2, options.size.y / 2, options.size.z / 2);
        this.collider = options.world.createCollider(this.colliderDesc, this.body);

        // Add to scene
        this.position.copy(this.body.translation())
        this.quaternion.copy(this.body.rotation());
        options.scene.add(this);
    }
}

export { Cube };