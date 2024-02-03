import { Graphics } from './Graphics';
import { Entities } from './entities/Entities.js';
import { EntityFactory } from './entities/EntityFactory.js';
import { Connector } from './Connector.js';
import { Physics } from './Physics';

class Client {
  constructor(canvas) {
    this.graphics = new Graphics(canvas);
    this.physics = new Physics();
    this.entities = new Entities(this.graphics.scene, this.physics.world);
    this.entityFactory = new EntityFactory();
    this.physics.setTick(30);
    this.connector = new Connector();
    this.player;
  }

  load(assets) {
    // Initialize player entity
    this.player = this.entityFactory.createPlayer({
      position: { x: 0, y: 2.5, z: 0 },
      model: assets.models.duplicate('player')
    });
    this.player.model.play('Idle', 0); // Start idle animation
    this.player.addEventListeners();
    this.entities.add(this.player);

    // Set camera to player camera
    this.graphics.setCamera(this.player.camera);
    this.graphics.setSelectedObjects([this.player.model]);

    // Add background entity
    var background = this.entityFactory.createBackground({ radius: 50 });
    this.entities.add(background);

    // Create array of meshes from model
    var dungeonModel = assets.models.duplicate('dungeon-forge');
    var triMesh = this.entityFactory.createTriMeshFromModel(dungeonModel);
    this.entities.add(triMesh);
  }

  updateBodies(delta) {
    this.entities.updateBodies(delta)
    this.physics.step();
  }

  updateObjects(delta, alpha) {
    this.entities.updateObjects(delta, alpha);
    this.graphics.update(delta); // Update 3D engine
  }
}

export { Client };