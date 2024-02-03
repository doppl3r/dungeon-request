/*
  This class manages a list of entities and their relationships
  with scenes (Three.js) and worlds (Rapier.js)
*/

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