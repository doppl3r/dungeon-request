import { TriMesh as TriMeshShape } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

/*
  A TriMesh expects a single set of vertices and indices
*/

class TriMesh extends Entity {
  constructor(options) {
    // Resolve null option values
    if (options.name == null) options.name = 'trimesh';
    if (options.vertices == null) options.vertices = new Float32Array();
    if (options.indices == null) options.indices = new Uint16Array();
    if (options.type == null) options.type = 'Fixed';

    // Create physical shape
    options.shape = new TriMeshShape(options.vertices, options.indices);

    // Inherit Entity class
    super(options);
  }
}

export { TriMesh };