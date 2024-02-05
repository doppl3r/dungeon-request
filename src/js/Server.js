import { EntityFactory } from './entities/EntityFactory.js';
import { EntityManager } from './entities/EntityManager.js';
import { Connector } from './Connector.js';
import { Physics } from './Physics';

/*
  The server contains a physics library for creating unique
  entities for clients.

  To encourage an authoritative system, let the server request
  and manage all data from each clients.
*/

class Server {
  constructor() {
    this.entityManager = new EntityManager();
    this.entityFactory = new EntityFactory();
    this.physics = new Physics();
    this.physics.setTick(30);
    this.connector = new Connector();
  }

  load(assets) {
    // Assign assets for later
    this.assets = assets;

    // Add background entity
    var background = this.entityFactory.createBackground({ radius: 50 });
    this.entityManager.add(background);

    // Create array of meshes from model
    var dungeonModel = assets.models.duplicate('dungeon-forge');
    var triMesh = this.entityFactory.createTriMesh({ model: dungeonModel });
    this.entityManager.add(triMesh);

    // Add connection data event listener from client(s)
    this.connector.on('connection_data', function(e) {
      // Receive client player data
      if (e.data.type == 'client_send_player_data') {
        if (e.connection.status == 'ready') {
          // TODO: Update player entity from client

        }
        else {
          // Update client status
          e.connection.status = 'ready';
  
          // Add unique player entity to the server entity manager
          var player = this.entityFactory.createPlayer({
            uuid: e.data.entity.uuid,
            position: { x: 0, y: 4, z: 0 }
          });
          this.entityManager.add(player);
        }
      }
    }.bind(this));
  }

  update(delta) {
    this.updateConnections();
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
      var data = {};
      var connection = this.connector.connections[i];

      // Check if player has been added to the server
      if (connection.status == null) {
        data = { type: 'server_request_player_data' };
      }
      else if (connection.status == 'ready') {
        // Send current server session to each player
        data = { type: 'session', entities: this.entityManager.toJSON() };
      }

      // Send connection data
      connection.send(data);
    }
  }

  addPlayerData(data) {
    console.log(data);
  }
}

export { Server };