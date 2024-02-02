import { Graphics } from './Graphics';
import { Entities } from './entities/Entities.js';
import { Connector } from './Connector.js';
import { Physics } from './Physics';
import { Player } from './entities/Player';

class Client {
  constructor(canvas) {
    this.graphics = new Graphics(canvas);
    this.physics = new Physics();
    this.entities = new Entities(this.graphics.scene, this.physics.world);
    this.physics.setTick(30);
    this.connector = new Connector();
    this.player;
  }

  load(assets) {
    // Initialize player entity
    this.player = new Player({
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
    this.entities.addBackground({ radius: 50 });

    // Add meshes from dungeon model
    this.entities.addDungeon(assets.models.duplicate('dungeon-forge'));
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