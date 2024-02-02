import { Background } from './Background';
import { TriMesh } from './TriMesh';

class Entities {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.list = [];
  }

  addBackground(options) {
    var background = new Background(options);
    this.add(background);
  }

  addTriMeshesFromModel(model) {
    var meshes = [];
    model.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        meshes.push(child);
      }
    });

    // Create TriMeshes from dungeon
    meshes.forEach(function(mesh) {
      this.addTriMesh(mesh);
    }.bind(this));
  }

  addTriMesh(mesh) {
    // Create TriMeshes from dungeon
    var type = 'Fixed'; // Rapier RigidBody type
    var name = mesh.name;
    var isDynamic = name.includes('-Dynamic');
    var isSensor = name.includes('-Sensor');
    if (isDynamic == true) type = 'Dynamic';
    var triMesh = new TriMesh({
      isSensor: isSensor,
      mesh: mesh,
      group: 0,
      type: type
    });
    this.add(triMesh);
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