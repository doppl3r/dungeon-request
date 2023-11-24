import { TriMesh as TriMeshShape } from '@dimforge/rapier3d';
import { Body } from './Body.js';

class TriMesh extends Body {
    constructor(options) {
        var vertices = options.mesh.geometry.attributes.position.array;
        var indices = options.mesh.geometry.index.array;

        // Assign body shape
        options = Object.assign({
            shape: new TriMeshShape(vertices, indices),
            type: 'Fixed'
        }, options);

        // Inherit Body class
        super(options);

        // Initialize default cube mesh
        this.mesh = options.mesh;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
    }
}

export { TriMesh };