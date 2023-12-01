import { Peer } from 'peerjs';
import { MathUtils } from 'three';

class Network {
	constructor(prefix = '') {
		this.prefix = prefix;
    this.isHost = false;
    this.tick = 10;
	}

  join(id) {

  }

  host(id) {
    // Generate new id
    if (id == null) id = MathUtils.generateUUID();

    // Reset peer if already created
    if (this.peer) this.peer.destroy();

    // Initialize peer with unique id
    this.peer = new Peer(this.prefix + id); // Generate random ID
    this.isHost = true;

    // Open connection
    this.peer.on('open', function(id) {
      console.log('Your are now hosting', id);

      // Listen to guest connections
      this.peer.on('connection', function(conn) {
        _self.addGuest(conn);
      });
    }.bind(this));
  }

  update(data) {
    //console.log(data);
  }

  setTick(tick = 60) {
    this.tick = tick;
  }
}

export { Network };