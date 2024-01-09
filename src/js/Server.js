import { Peer } from 'peerjs';
import { MathUtils } from 'three';
import { Session } from './Session';

class Server {
  constructor() {
    this.session = new Session();
  }

  update(delta) {
    
  }

  host(id_host, callback = function(){}) {
    // Open connection and listen to guests
    if (id_host == null) id_host = MathUtils.generateUUID();

    // Reset peer if already created
    if (this.peer) this.peer.destroy();

    // Initialize peer with unique id
    this.peer = new Peer(id_host); // Generate random ID
    this.peer.on('open', function(id) {
      // Confirm connection is ready
      this.emitPeerOpen(id, callback);
      
      // Add event listeners from client(s)
      this.peer.on('connection', function(conn) {
        conn.on('open', function() { this.emitConnectionOpen(conn); }.bind(this)); // Add connection open listener
        conn.on('close', function() { this.emitConnectionClose(conn); }.bind(this)); // Add disconnection listener
        conn.on('data', function(data) { this.emitConnectionData(data); }.bind(this)); // Add inbound data listener
        conn.on('error', function(error) { this.emitConnectionError(error); }.bind(this)); // Add connection error listener
      }.bind(this));
    }.bind(this));

    // Listen to peer errors
    this.peer.on('error', function(error){ this.emitPeerError(error); }.bind(this));
  }

  emitPeerOpen(id, callback = function(){}) {
    console.log('Server is ready for clients to connect', id);
    callback(id); // Perform custom callback
  }

  emitPeerError(error) {
    console.log('Server error', error);
  }

  emitConnectionOpen(conn) {
    console.log('Client connected to server', conn.peer);
  }

  emitConnectionClose(conn) {
    console.log('Client disconnected from server', conn.peer);
  }

  emitConnectionData(data) {
    console.log('Client sent data', data);
  }

  emitConnectionError(error) {
    console.log('Client error', error);
  }
}

export { Server };