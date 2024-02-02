import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Cuboid as CuboidShape } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

class Cuboid extends Entity {
  constructor(options) {
    // Resolve null option values
    if (options.name == null) options.name = 'cuboid';
    if (options.color == null) options.color = '#ffffff';

    // Create physical shape
    options.shape = new CuboidShape(options.scale.x / 2, options.scale.y / 2, options.scale.z / 2)

    // Inherit Entity class
    super(options);

    // Initialize default cube mesh
    var geometry = new BoxGeometry(options.scale.x, options.scale.y, options.scale.z);
    var material = new MeshStandardMaterial({ color: options.color });
    var mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.object.add(mesh);
  }
}

export { Cuboid };