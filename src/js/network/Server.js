import { EntityFactory } from '../entities/EntityFactory.js';
import { EntityManager } from '../entities/EntityManager.js';
import { Connector } from './Connector.js';
import { Physics } from '../Physics.js';

/*
  The server contains a physics library for creating unique
  entities for clients.

  To encourage an authoritative system, let the server request
  and manage all data from each clients.
*/

class Server extends Connector {
  constructor() {
    super(); // Inherit Connector
    this.entityManager = new EntityManager();
    this.entityFactory; // Wait to initialize when assets are loaded
    this.physics = new Physics();
    this.physics.setTick(30);
  }

  load(assets) {
    // Assign assets to a new entity factory instance
    this.entityFactory = new EntityFactory(assets);

    // Add background entity
    var background = this.entityFactory.createBackground({ radius: 50 });
    this.entityManager.add(background);

    // Create array of meshes from model
    var triMesh = this.entityFactory.createTriMesh({ model: { name: 'dungeon-demo' }});
    this.entityManager.add(triMesh);

    // Add connection data event listener from client(s)
    this.on('connection_data', function(event) { this.processData(event); }.bind(this));
  }

  update(delta) {
    this.sendData();
  }

  updateBodies(delta) {
    this.entityManager.updateBodies(delta)
    this.physics.step();
  }

  updateObjects(delta, alpha) {
    this.entityManager.updateObjects(delta, alpha)
  }

  processData(event) {
    // Receive client player data
    if (event.data.type == 'client_send_player_data') {
      if (event.connection.status == null) {
        // Update client status
        event.connection.status = 'ready';

        // Add unique player entity to the server entity manager
        var player = this.entityFactory.create(event.data.entity);
        this.entityManager.add(player);
      }
      else if (event.connection.status == 'ready') {
        // TODO: Update player entity from client
      }
    }
  }

  sendData() {
    // Create empty data
    var data = {};

    // Loop through all connection on server
    this.connections.forEach(function(connection) {
      // Check if player has been added to the server
      if (connection.status == null) {
        data = { type: 'server_request_player_data' };
      }
      else if (connection.status == 'ready') {
        // Send current server session to each player
        data = { type: 'session', entities: this.entityManager.toJSON() };
      }

      // Send (or process) connection data
      if (connection == this.link) this.link.processData({ type: 'connection_data', data: data, connection: this });
      else connection.send(data);
    }.bind(this));
  }
}

export { Server };