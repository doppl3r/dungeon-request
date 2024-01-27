import { Session } from './Session';
import { Network } from './Network.js';

/*
  The server contains a separate graphic and physics library for
  creating unique entities for clients.
*/

class Server {
  constructor(scene, world) {
    this.session = new Session(scene, world);
    this.network = new Network();
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