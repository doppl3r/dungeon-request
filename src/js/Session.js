import { Entities } from './Entities.js';
import { Background } from './Background';
import { Sun } from './Sun';

class Session {
  constructor(scene, world) {
    this.state = 0;
    this.map = 'dungeon-crypt'
    this.entities = new Entities(scene, world);
  }

  updateBodies(delta) {
    this.entities.updateBodies(delta);
  }

  updateObjects(delta, alpha) {
    this.entities.updateObjects(delta, alpha);
  }

  loadWorld(assets) {
    // Add meshes from dungeon model
    var model = assets.models.duplicate(this.map);

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
      this.entities.addTriMesh(mesh);
    }.bind(this));

    // Add background
    this.background = new Background({ radius: 50 });
    this.entities.scene.add(this.background);

    // Add sun to scene
    this.sun = new Sun();
    this.sun.update(36);
    this.entities.scene.add(this.sun);
  }

  loadEntities(scene, world) {

  }

  spawnPlayers() {

  }

  toJSON() {
    var json = {
      entities: this.entities.toJSON(),
      map: this.map,
      timestamp: Date.now(),
      type: 'session'
    };

    return json;
  }
}

export { Session };