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
  constructor(assets) {
    // Assign assets for creation
    this.assets = assets;
  }

  create(options) {
    // Call function by class name
    var fn = this['create' + options.class].bind(this);
    if (fn == null) return;
    return fn(options);
  }

  createBackground(options) {
    this.updateOptions(options);
    return new Background(options);
  }
  
  createCuboid(options) {
    this.updateOptions(options);
    return new Cuboid(options);
  }
  
  createPlayer(options) {
    this.updateOptions(options);
    return new Player(options);
  }
  
  createSphere(options) {
    this.updateOptions(options);
    return new Sphere(options);
  }
  
  createTriMesh(options) {
    this.updateOptions(options);
    return new TriMesh(options);
  }

  updateOptions(options) {
    // Add model from assets if model name exists
    if (options.model) {
      options.model = this.assets.models.duplicate(options.model.name);
    }
  }
}

export { EntityFactory }