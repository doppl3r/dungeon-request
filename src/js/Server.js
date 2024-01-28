import { Entities } from './Entities.js';
import { Network } from './Network.js';
import { Physics } from './Physics';

/*
  The server contains a separate graphic and physics library for
  creating unique entities for clients.
*/

class Server {
  constructor() {
    this.entities = new Entities();
    this.network = new Network();
    this.physics = new Physics();
    this.physics.setTick(30);
  }

  init(assets) {
    // Add background entity
    this.entities.addBackground({ radius: 50 });

    // Add meshes from dungeon model
    var model = assets.models.duplicate('dungeon-crypt');
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
  }

  update(delta) {
    
  }

  updateBodies(delta) {
    this.entities.updateBodies(delta)
    this.physics.step();
  }

  updateObjects(delta, alpha) {
    this.entities.updateObjects(delta, alpha)
  }
}

export { Server };