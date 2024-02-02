import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Background } from './Background';
import { TriMesh } from './TriMesh';

class Entities {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.list = [];
  }

  updateBodies(delta) {
    // Update all entities
    this.list.forEach(function(child) {
        if (child.body) child.updateBody(delta);
    });
  }

  updateObjects(delta, alpha) {
    // Update each 3D object
    this.list.forEach(function(child) {
      child.updateObject(delta, alpha);
    });
  }

  add(entity) {
    this.list.push(entity);
    if (this.scene) entity.addToScene(this.scene);
    if (this.world) entity.addToWorld(this.world);
  }

  addBackground(options) {
    var background = new Background(options);
    this.add(background);
  }

  addDungeon(model) {
    // Merge geometries from all meshes
    var geometry;
    var geometries = [];
    model.traverse(function(child) {
      if (child.isMesh) {
        geometry = child.geometry.clone();
        geometry.rotateX(child.rotation.x);
        geometry.rotateY(child.rotation.y);
        geometry.rotateZ(child.rotation.z);
        geometry.scale(child.scale.x, child.scale.y, child.scale.z);
        geometry.translate(child.position.x, child.position.y, child.position.z);
        geometries.push(geometry);
      }
    });
    geometry = mergeGeometries(geometries);

    // Create TriMesh from merged geometry
    var vertices = geometry.attributes.position.array;
    var indices = geometry.index.array;
    var triMesh = new TriMesh({
      indices: indices,
      model: model,
      name: model.name,
      vertices: vertices
    });

    // Add TriMesh entity
    this.add(triMesh);
  }

  remove(entity) {
    var index = this.list.indexOf(entity);
    this.list.splice(index, 1);
    if (this.scene) entity.removeFromScene(this.scene);
    if (this.world) entity.removeFromWorld(this.world);
  }

  toJSON() {
    var json = [];
    for (var i = 0; i < this.list.length; i++) {
      var entity = this.list[i];
      json.push(entity.toJSON());
    }
    return json;
  }
}

export { Entities };