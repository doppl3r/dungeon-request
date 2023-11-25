import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three';
import { Box, Vec3 } from 'cannon-es';
import { Body } from './Body.js';

class Cuboid extends Body {
  constructor(options) {
    // Assign body shape
    options = Object.assign({
      color: '#ffffff',
      type: 1, // 1 = DYNAMIC, 4 = KINEMATIC, 2 = STATIC
      shape: new Box(new Vec3(options.size.x / 2, options.size.y / 2, options.size.z / 2))
    }, options);

    // Inherit Body class
    super(options);

    // Initialize default cube mesh
    var geometry = new BoxGeometry(options.size.x, options.size.y, options.size.z);
    var material = new MeshNormalMaterial({ color: options.color });
    var mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.object.add(mesh);
  }
}

export { Cuboid };