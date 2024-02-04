/*
  This class manages a list of entities and their relationships
  with scenes (Three.js) and worlds (Rapier.js)
*/

class EntityManager {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.entities = [];
  }

  updateBodies(delta) {
    // Update all entities
    this.entities.forEach(function(child) {
        if (child.body) child.updateBody(delta);
    });
  }

  updateObjects(delta, alpha) {
    // Update each 3D object
    this.entities.forEach(function(child) {
      child.updateObject(delta, alpha);
    });
  }

  add(entity) {
    this.entities.push(entity);
    if (this.scene) entity.addToScene(this.scene);
    if (this.world) entity.addToWorld(this.world);
  }

  remove(entity) {
    var index = this.entities.indexOf(entity);
    this.entities.splice(index, 1);
    if (this.scene) entity.removeFromScene(this.scene);
    if (this.world) entity.removeFromWorld(this.world);
  }

  empty() {
    for (var i = this.entities.length - 1; i >= 0; i--) {
      this.remove(this.entities[i]);
    }
  }

  toJSON() {
    var json = [];
    for (var i = 0; i < this.entities.length; i++) {
      var entity = this.entities[i];
      json.push(entity.toJSON());
    }
    return json;
  }
}

export { EntityManager };