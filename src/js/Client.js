import { Peer } from 'peerjs';

class Client {
  constructor(scene, world) {
    
  }

  update(delta) {
    
  }

  join(id_host, callback = function(){}) {
    // Reset peer if already created
    if (this.peer) this.peer.destroy();

    // Initialize peer with unique id
    this.peer = new Peer(); // Generate random ID
    this.peer.on('open', function(id) {
      // Confirm connection is ready
      this.dispatchPeerOpen(id, callback);

      // Connect to host
      var conn = this.peer.connect(id_host);

      // Add event listeners from host
      conn.on('open', function() { this.dispatchConnectionOpen(conn); }.bind(this)); // Add open listener
      conn.on('close', function() { this.dispatchConnectionClose(conn); }.bind(this)); // Add disconnection listener
      conn.on('data', function(data) { this.dispatchConnectionData(data); }.bind(this)); // Add inbound data listener
      conn.on('error', function(error) { this.dispatchConnectionError(error); }); // Add connection error listener
    }.bind(this));

    // Listen to peer errors
    this.peer.on('error', function(error){ this.dispatchPeerError(error); }.bind(this));
  }

  dispatchPeerOpen(id, callback = function(){}) {
    console.log('Client is ready to connect to a server', id);
    callback(id);
  }

  dispatchPeerError(error) {
    console.log('Client error', error);
  }

  dispatchConnectionOpen(conn) {
    console.log('Server connected to client', conn.peer);
  }

  dispatchConnectionClose(conn) {
    console.log('Server disconnected from client', conn.peer);
  }

  dispatchConnectionData(data) {
    console.log('Server sent data', data);
  }

  dispatchConnectionError(error) {
    console.log('Server error', error);
  }
}

export { Client };