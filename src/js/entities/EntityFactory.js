import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Background } from './Background';
import { Cuboid } from './Cuboid';
import { Player } from './Player';
import { Sphere } from './Sphere';
import { TriMesh } from './TriMesh';

/*
  This class creates new entity instances that are compatible
  with Three.js and Rapier.js
*/

class EntityFactory {
  constructor() {

  }

  createBackground(options) {
    return new Background(options);
  }

  createCuboid(options) {
    return new Cuboid(options);
  }

  createPlayer(options) {
    return new Player(options);
  }

  createSphere(options) {
    return new Sphere(options);
  }

  createTriMesh(options) {
    return new TriMesh(options);
  }

  createTriMeshFromModel(model) {
    // Merge geometries from all meshes
    var geometry;
    var geometries = [];
    model.traverse(function(child) {
      if (child.isMesh) {
        // Translate geometry attributes to world origin
        geometry = child.geometry;
        geometry.rotateX(child.rotation.x);
        geometry.rotateY(child.rotation.y);
        geometry.rotateZ(child.rotation.z);
        geometry.scale(child.scale.x, child.scale.y, child.scale.z);
        geometry.translate(child.position.x, child.position.y, child.position.z);
        geometries.push(geometry);
        child.position.set(0, 0, 0);
        child.rotation.set(0, 0, 0);
        child.scale.set(1, 1, 1);
      }
    });
    geometry = mergeGeometries(geometries);

    // Create TriMesh from merged geometry
    var vertices = geometry.attributes.position.array;
    var indices = geometry.index.array;
    return this.createTriMesh({ indices: indices, model: model, name: model.name, vertices: vertices })
  }
}

export { EntityFactory }