import { Trimesh as TriMeshShape } from 'cannon-es';
import { Body } from './Body.js';

class TriMesh extends Body {
	constructor(options) {
		var vertices = options.mesh.geometry.attributes.position.array;
		var indices = options.mesh.geometry.index.array;

		// Assign body shape
		options = Object.assign({
			shape: new TriMeshShape(vertices, indices),
			mass: 0
		}, options);

		// Inherit Body class
		super(options);

		// Add 3D object
		this.object.add(options.mesh);
	}
}

export { TriMesh };