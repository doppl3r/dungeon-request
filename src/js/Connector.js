import { EventDispatcher, MathUtils } from 'three';
import { Peer } from 'peerjs';

/*
  This class acts as a container for the PeerJS library. It
  provides an event dispatcher for local and remote connections.
*/

class Connector extends EventDispatcher {
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
    var connection = this.peer.connect(host_id);
    this.listen(connection);
  }

  listen(connection) {
    // Add event listers to connection
    connection.on('open', function() { this.dispatchEvent({ type: 'connection_open', connection: connection }); }.bind(this));
    connection.on('close', function() { this.dispatchEvent({ type: 'connection_close', connection: connection }); }.bind(this));
    connection.on('data', function(data) { this.dispatchEvent({ type: 'connection_data', connection: connection, data: data }); }.bind(this));
    connection.on('error', function(error) { this.dispatchEvent({ type: 'connection_error', connection: connection, error: error }.bind(this)); });
  }

  on(type, callback) {
    this.addEventListener(type, callback);
  }
}

export { Connector };