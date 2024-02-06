import { EventDispatcher, MathUtils } from 'three';

/*
  A local peer acts as an offline event broker for the host. It mimics
  the PeerJS peer functionality without needing to connect with internet.
*/

class PeerLocal extends EventDispatcher {
  constructor(id) {
    super();
    this.id = id;
    this.connections = new Map();

    this.dispatchEvent({ type: 'open', id: id });
  }
}

export { PeerLocal };