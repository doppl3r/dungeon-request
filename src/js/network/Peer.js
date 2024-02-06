import { EventDispatcher, MathUtils } from 'three';
import { Peer as PeerJS } from 'peerjs';

/*
  A local peer acts as an PeerJS container that can operate offline. 
*/

class Peer extends PeerJS {
  constructor(id) {
    // Generate new id
    if (id == null) id = MathUtils.generateUUID();

    // Inherit Peer.js properties
    super(id);

    // Assign global reference to this peer
    window[id] = this;
    this.events = new EventDispatcher();
  }

  on(type, callback) {
    super.on(type, callback);
    this.events.addEventListener(type, callback);
  }
}

export { Peer };