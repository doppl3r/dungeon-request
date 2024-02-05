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

  create(options) {
    // Call function by class name
    var fn = this['create' + options.name];
    if (fn == null) return;
    return fn(options);
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
}

export { EntityFactory }