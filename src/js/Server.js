import { Entities } from './entities/Entities.js';
import { Connector } from './Connector.js';
import { Physics } from './Physics';

/*
  The server contains a separate graphic and physics library for
  creating unique entities for clients.
*/

class Server {
  constructor() {
    this.entities = new Entities();
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
    this.entities.updateBodies(delta)
    this.physics.step();
  }

  updateObjects(delta, alpha) {
    this.entities.updateObjects(delta, alpha)
  }

  updateConnections() {
    // Loop through all connection on server
    for (var i = 0; i < this.connector.connections.length; i++) {
      var connection = this.connector.connections[i];
      connection.send({ entities: this.entities.toJSON() });
    }
  }
}

export { Server };