import { EventDispatcher, MathUtils } from 'three';
import { Peer } from 'peerjs';

class NetworkDispatcher extends EventDispatcher {
  constructor() {
    super(); // Inherit EventDispatcher
  }

  open(id) {
    // Generate new id
    if (id == null) id = MathUtils.generateUUID();

    // Reset peer if already created
    if (this.peer) this.peer.destroy();

    // Initialize peer with unique id
    this.peer = new Peer(id); // Generate random ID
    this.peer.on('open', function(id) {
      // Confirm connection is ready
      this.dispatchEvent({ type: 'peer_open', id: id });
      
      // Add event listeners to host from client(s)
      this.peer.on('connection', function(conn) { this.listen(conn); }.bind(this));
    }.bind(this));

    // Listen to peer errors
    this.peer.on('error', function(error){ this.dispatchEvent({ type: 'peer_error', error: error }); }.bind(this));
  }

  connect(host_id) {
    // Connect to host
    var conn = this.peer.connect(host_id);
    this.listen(conn);
  }

  listen(conn) {
    // Add event listers to connection
    conn.on('open', function() { this.dispatchEvent({ type: 'connection_open', connection: conn }); }.bind(this));
    conn.on('close', function() { this.dispatchEvent({ type: 'connection_close', connection: conn }); }.bind(this));
    conn.on('data', function(data) { this.dispatchEvent({ type: 'connection_data', connection: conn, data: data }); }.bind(this));
    conn.on('error', function(error) { this.dispatchEvent({ type: 'connection_error', connection: conn, error: error }.bind(this)); });
  }

  on(type, callback) {
    this.addEventListener(type, callback);
  }
}

export { NetworkDispatcher };