import { Player } from './entities/Player';
import { Session } from './Session';
import { Graphics } from './Graphics';
import { Physics } from './Physics';
import { Network } from './Network.js';

class Client {
  constructor(scene, world) {
    this.session = new Session(scene, world);
    this.player = new Player({ position: { x: 0, y: 1, z: 0 } });
    this.network = new Network();
  }

  init(assets) {
    this.player.addModel(assets.models.duplicate('player'));
    this.player.model.play('Idle', 0); // Start idle animation
    this.player.addEventListeners();
    this.session.entities.add(this.player);
  }

  updateBodies(delta) {
    this.session.updateBodies(delta);
  }

  updateObjects(delta, alpha) {
    this.session.updateObjects(delta, alpha);
  }
}

export { Client };