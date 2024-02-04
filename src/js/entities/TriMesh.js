import { TriMesh as TriMeshShape } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

/*
  A TriMesh creates a rigid body from a set of vertices and
  indices. TriMeshes have no interior and should only be used
  for terrain or other fixed object types.
*/

class TriMesh extends Entity {
  constructor(options) {
    // Resolve null option values
    if (options.vertices == null) options.vertices = new Float32Array();
    if (options.indices == null) options.indices = new Uint16Array();
    if (options.type == null) options.type = 'Fixed';

    // Create physical shape
    options.shape = new TriMeshShape(options.vertices, options.indices);

    // Inherit Entity class
    super(options);
    this.name = 'TriMesh';
  }
}

export { TriMesh };