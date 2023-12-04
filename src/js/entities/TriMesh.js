import { TriMesh as TriMeshShape } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

class TriMesh extends Entity {
  constructor(options) {
    var vertices = options.mesh.geometry.attributes.position.array;
    var indices = options.mesh.geometry.index.array;

    // Resolve null option values
    if (options.type == null) options.type = 'Fixed'

    // Create physical shape
    options.shape = new TriMeshShape(vertices, indices);

    // Inherit Entity class
    super(options);

    // Add 3D object
    this.object.add(options.mesh);
  }
}

export { TriMesh };