import { Graphics } from '../Graphics.js';
import { EntityManager } from '../entities/EntityManager.js';
import { EntityFactory } from '../entities/EntityFactory.js';
import { Connector } from './Connector.js';
import { Physics } from '../Physics.js';

class Client extends Connector {
  constructor(canvas) {
    super(); // Inherit Connector
    this.graphics = new Graphics(canvas);
    this.physics = new Physics();
    this.entityManager = new EntityManager(this.graphics.scene, this.physics.world);
    this.entityFactory; // Wait to initialize when assets are loaded
    this.physics.setTick(30);
    this.player;
  }
  
  load(assets) {
    // Assign assets for later
    this.entityFactory = new EntityFactory(assets);

    // Initialize player entity
    this.player = this.entityFactory.createPlayer({ model: { name: 'player' }, position: { x: 0, y: 2.5, z: 0 }});
    this.player.model.play('Idle', 0); // Start idle animation
    this.player.addEventListeners();

    // Set camera to player camera
    this.graphics.setCamera(this.player.camera);
    this.graphics.setSelectedObjects([this.player.model]);

    // Add connection data event listener
    this.on('connection_data', function(e) {
      // Digest server entities
      this.processData(e.data);
    }.bind(this));
  }

  updateBodies(delta) {
    this.entityManager.updateBodies(delta)
    this.physics.step();
  }

  updateObjects(delta, alpha) {
    this.entityManager.updateObjects(delta, alpha);
    this.graphics.update(delta); // Update 3D engine
  }

  processData(data) {
    if (data.type == 'server_request_player_data') {
      // Send player data back to the server
      this.entityManager.drain(); // Drain entities before receiving server entities
    }
    else if (data.type == 'session') {
      // Loop through all entities
      data.entities.forEach(function(entityJSON) {
        // Create entity if it does not exist on client
        if (this.entityManager.get(entityJSON.uuid) == null) {
          // Create new entity or assign to the client player
          var entity;
          if (entityJSON.uuid != this.player.uuid) entity = this.entityFactory.create(entityJSON);
          else entity = this.player;
  
          // Add entity to the current entity map
          this.entityManager.add(entity);
        }
        else {
          // Get client entity by uuid
          var entity = this.entityManager.get(entityJSON.uuid);
  
          // Update non-player entities
          if (entity != this.player) {
            // Update client entities from server entity info (ex: position)
            entity.updateFromJSON(entityJSON);
          }
        }
      }.bind(this));
    }

    // Send player data after processing
    this.sendData();
  }

  sendData() {
    // Access server connection via map loop
    this.connections.forEach(function(connection) {
      var data = {
        type: 'client_send_player_data',
        entity: this.player.toJSON()
      };

      // Send (or process) connection data
      if (connection == this.link) this.link.processData(data);
      else connection.send(data);
    }.bind(this));
  }
}

export { Client };