import { EventDispatcher, MathUtils } from 'three';
import { Peer } from 'peerjs';

/*
  This class acts as a container for the PeerJS library. It
  provides an event dispatcher for local and remote connections.
*/

class Connector extends EventDispatcher {
  constructor() {
    super(); // Inherit EventDispatcher
    this.connections = new Map();
  }

  open(id) {
    // Generate new id
    if (id == null) id = MathUtils.generateUUID();

    // Reset peer if already created
    if (this.peer) this.peer.destroy();

    // Initialize peer with unique id
    this.peer = new Peer(id); // Generate random ID
    this.addPeerListeners(this.peer);
  }

  connect(host_id) {
    // Connect to remote host
    var connection = this.peer.connect(host_id);
    this.addConnectionListeners(connection);
  }

  addPeerListeners(peer) {
    peer.on('open', function(id) {
      // Confirm connection is ready
      this.dispatchEvent({ type: 'peer_open', id: id });
    }.bind(this));

    // Add event listeners to host from client(s)
    peer.on('connection', function(connection) {
      this.addConnectionListeners(connection);
      this.dispatchEvent({ type: 'peer_connection', connection: connection })
    }.bind(this));

    // Listen to peer close (use peer.destroy to clean up connections)
    peer.on('close', function() {
      this.connections.clear(); // Clear connections map
      this.dispatchEvent({ type: 'peer_close', peer: peer });
    }.bind(this))

    // Listen to peer disconnection
    peer.on('disconnected', function() {
      this.dispatchEvent({ type: 'peer_disconnected', peer: peer });
    }.bind(this));

    // Listen to peer errors
    peer.on('error', function(error){
      this.dispatchEvent({ type: 'peer_error', error: error });
    }.bind(this));
  }

  addConnectionListeners(connection) {
    // Dispatch connection open
    connection.on('open', function() {
      this.connections.set(connection.peer, connection); // Add to connections map using peer id
      this.dispatchEvent({ type: 'connection_open', connection: connection });
    }.bind(this));

    // Dispatch connection close
    connection.on('close', function() {
      this.connections.delete(connection.peer); // Remove from connections map using peer id
      this.dispatchEvent({ type: 'connection_close', connection: connection });
    }.bind(this));

    // Dispatch connection data
    connection.on('data', function(data) {
      this.dispatchEvent({ type: 'connection_data', connection: connection, data: data });
    }.bind(this));

    // Dispatch connection error
    connection.on('error', function(error) {
      this.dispatchEvent({ type: 'connection_error', connection: connection, error: error });
    });
  }

  on(type, callback) {
    this.addEventListener(type, callback);
  }
}

export { Connector };