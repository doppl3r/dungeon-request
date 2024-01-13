import { Peer } from 'peerjs';
import { MathUtils } from 'three';
import { Session } from './Session';
import { Graphics } from './Graphics';
import { Physics } from './Physics';

/*
  The server contains a separate graphic and physics library for
  creating unique entities for clients.
*/

class Server {
  constructor() {
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

  host(host_id, callback = function(){}) {
    if (host_id == 'local') {

    }
    else {
      // Generate new id
      if (host_id == null) host_id = MathUtils.generateUUID();

      // Reset peer if already created
      if (this.peer) this.peer.destroy();
  
      // Initialize peer with unique id
      this.peer = new Peer(host_id); // Generate random ID
      this.peer.on('open', function(id) {
        // Confirm connection is ready
        this.emitPeerOpen(id, callback);
        
        // Add event listeners from client(s)
        this.peer.on('connection', function(conn) {
          conn.on('open', function() { this.emitConnectionOpen(conn); }.bind(this)); // Add connection open listener
          conn.on('close', function() { this.emitConnectionClose(conn); }.bind(this)); // Add disconnection listener
          conn.on('data', function(data) { this.emitConnectionData(conn, data); }.bind(this)); // Add inbound data listener
          conn.on('error', function(error) { this.emitConnectionError(conn, error); }.bind(this)); // Add connection error listener
        }.bind(this));
      }.bind(this));
  
      // Listen to peer errors
      this.peer.on('error', function(error){ this.emitPeerError(error); }.bind(this));
    }
  }

  emitPeerOpen(id, callback = function(){}) {
    console.log('Server (' + this.peer.id + ') is ready for clients to connect');
    callback(id); // Perform custom callback
  }

  emitPeerError(error) {
    console.log('Server (' + this.peer.id + ') error: ', error);
  }

  emitConnectionOpen(conn) {
    console.log('Client (' + conn.peer + ') connected to server (' + this.peer.id + ')');
    // Send all session data to client
    conn.send(this.session.toJSON())
  }

  emitConnectionClose(conn) {
    console.log('Client (' + conn.peer + ') disconnected from server (' + this.peer.id + ')');
  }

  emitConnectionData(conn, data) {
    console.log('Client (' + conn.peer + ') sent data to server (' + this.peer.id + '): ', data);
  }

  emitConnectionError(conn, error) {
    console.log('Client (' + conn.peer + ') error: ', error);
  }
}

export { Server };