import { Player } from './entities/Player';
import { Graphics } from './Graphics';
import { Physics } from './Physics';
import { Debugger } from './Debugger.js';
import { Session } from './Session';
import { Network } from './Network.js';

class Client {
  constructor(canvas) {
    this.graphics = new Graphics(canvas);
    this.physics = new Physics();
    this.physics.setTick(30);
    this.debugger = new Debugger(this.graphics.scene, this.physics.world);
    this.debugger.disable();
    this.session = new Session(this.graphics.scene, this.physics.world);
    this.player = new Player({ position: { x: 0, y: 1, z: 0 } });
    this.network = new Network();
  }

  init(assets) {
    this.player.addModel(assets.models.duplicate('player'));
    this.player.model.play('Idle', 0); // Start idle animation
    this.player.addEventListeners();
    this.session.entities.add(this.player);

    // Set camera to player camera
    this.graphics.setCamera(this.player.camera);
    this.graphics.setSelectedObjects([this.player.model]);
  }

  updateBodies(delta) {
    this.session.updateBodies(delta);
    this.debugger.update(); // Update debugger buffer
  }

  updateObjects(delta, alpha) {
    this.session.updateObjects(delta, alpha);
    this.graphics.update(delta); // Update 3D engine
  }
}

export { Client };