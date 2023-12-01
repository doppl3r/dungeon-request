import { TriMesh as TriMeshShape } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

class TriMesh extends Entity {
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

		// Add 3D object
		this.object.add(options.mesh);
	}
}

export { TriMesh };