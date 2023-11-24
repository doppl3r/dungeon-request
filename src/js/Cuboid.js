import { BoxGeometry, MeshStandardMaterial } from 'three';
import { Cuboid as CuboidShape } from '@dimforge/rapier3d';
import { Body } from './Body.js';

class Cuboid extends Body {
    constructor(options) {
        // Assign body shape
        options = Object.assign({
            color: '#ffffff',
            shape: new CuboidShape(options.size.x / 2, options.size.y / 2, options.size.z / 2)
        }, options);

        // Inherit Body class
        super(options);

        // Initialize default cube mesh
        this.mesh.geometry = new BoxGeometry(options.size.x, options.size.y, options.size.z);
        this.mesh.material = new MeshStandardMaterial({ color: options.color });
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
    }
}

export { Cuboid };