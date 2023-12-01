import { SphereGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Ball } from '@dimforge/rapier3d';
import { Entity } from './Entity.js';

class Sphere extends Entity {
  constructor(options) {
    // Assign body shape
    options = Object.assign({
      color: '#ffffff',
      radius: 1,
      widthSegments: 32,
      heightSegments: 16,
      shape: new Ball(options.radius)
    }, options);

    // Inherit Body class
    super(options);

    // Initialize default cube mesh
    var geometry = new SphereGeometry(options.radius, options.widthSegments, options.heightSegments);
    var material = new MeshStandardMaterial({ color: options.color });
    var mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.object.add(mesh);
  }
}

export { Sphere };