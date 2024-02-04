import { EntityManager } from './entities/EntityManager.js';
import { Connector } from './Connector.js';
import { Physics } from './Physics';

/*
  The server contains a separate graphic and physics library for
  creating unique entities for clients.
*/

class Server {
  constructor() {
    this.entityManager = new EntityManager();
    this.physics = new Physics();
    this.physics.setTick(30);
    this.connector = new Connector();
  }

  load(assets) {
    // Add background entity
    
  }

  update(delta) {
    
  }

  updateBodies(delta) {
    this.entityManager.updateBodies(delta)
    this.physics.step();
  }

  updateObjects(delta, alpha) {
    this.entityManager.updateObjects(delta, alpha)
  }

  updateConnections() {
    // Loop through all connection on server
    for (var i = 0; i < this.connector.connections.length; i++) {
      var connection = this.connector.connections[i];
      connection.send({ entities: this.entityManager.toJSON() });
    }
  }
}

export { Server };