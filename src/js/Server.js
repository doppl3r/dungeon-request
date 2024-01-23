import { Session } from './Session';
import { Graphics } from './Graphics';
import { Physics } from './Physics';
import { NetworkDispatcher } from './NetworkDispatcher.js';

/*
  The server contains a separate graphic and physics library for
  creating unique entities for clients.
*/

class Server extends NetworkDispatcher {
  constructor() {
    super(); // Inherit EventDispatch class
    this.graphics = new Graphics();
    this.physics = new Physics();
    this.session = new Session(this.graphics.scene, this.physics.world);
  }

  init(assets) {

  }

  update(delta) {
    
  }

  updateBodies(delta) {
    this.session.updateBodies(delta)
  }

  updateObjects(delta, alpha) {
    this.session.updateObjects(delta, alpha)
  }
}

export { Server };