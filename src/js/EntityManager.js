/*
  The entity manager organizes the list of entities for the game.
*/

class EntityManager {
  constructor() {
      this.entities = [];
  }

  updatePhysics(data) {
    this.entities.forEach(function(child) {
        if (child.rigidBody) child.takeSnapshot();
    });
  }

  updateGraphics(data) {
    this.entities.forEach(function(child) {
        if (child.rigidBody) child.lerp(data.alpha);
    });
  }

  add(entity) {
    this.entities.push(entity);
  }

  toJSON() {

  }
}

export { EntityManager };