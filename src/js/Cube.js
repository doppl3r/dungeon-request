import { BoxGeometry, MeshStandardMaterial } from 'three';
import { Cuboid } from '@dimforge/rapier3d';
import { Body } from './Body.js';

class Cube extends Body {
    constructor(options) {
        // Assign body shape
        options = Object.assign({
            color: '#ffffff',
            shape: new Cuboid(options.size.x / 2, options.size.y / 2, options.size.z / 2)
        }, options);

        // Inherit Body class
        super(options);

        // Initialize default cube mesh
        this.geometry = new BoxGeometry(options.size.x, options.size.y, options.size.z);
        this.material = new MeshStandardMaterial({ color: options.color });
        this.receiveShadow = true;
        this.castShadow = true;
    }
}

export { Cube };