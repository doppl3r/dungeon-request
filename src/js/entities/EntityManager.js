/*
  This class manages a list of entities and their relationships
  with scenes (Three.js) and worlds (Rapier.js)
*/

class EntityManager {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.entities = new Map();
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
    }.bind(this));
  }

  add(entity) {
    this.entities.set(entity.uuid, entity);
    if (this.scene) entity.addToScene(this.scene);
    if (this.world) entity.addToWorld(this.world);
  }

  remove(entity) {
    this.entities.delete(entity.uuid);
    if (this.scene) entity.removeFromScene(this.scene);
    if (this.world) entity.removeFromWorld(this.world);
  }

  get(key) {
    return this.entities.get(key);
  }

  empty() {
    this.entities.forEach(function(entity){
      this.remove(entity);
    }.bind(this));
  }

  toJSON() {
    var json = [];
    this.entities.forEach(function(entity){
      json.push(entity.toJSON());
    }.bind(this));
    return json;
  }
}

export { EntityManager };