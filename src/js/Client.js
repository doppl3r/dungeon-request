import { Peer } from 'peerjs';
import { Player } from './entities/Player';
import { Session } from './Session';

class Client {
  constructor(scene, world) {
    this.session = new Session(scene, world);
    this.player = new Player({
      position: { x: 0, y: 1, z: 0 }
    });
  }

  init(assets) {
    this.player.addModel(assets.models.duplicate('player'));
    this.player.model.play('Idle', 0); // Start idle animation
    this.player.addEventListeners();
    this.session.entities.add(this.player);
  }

  updateBodies(delta) {
    this.session.updateBodies(delta);
  }

  updateObjects(delta, alpha) {
    this.session.updateObjects(delta, alpha);
  }

  join(host_id, callback = function(){}) {
    // Reset peer if already created
    if (this.peer) this.peer.destroy();

    // Initialize peer with unique id
    this.peer = new Peer(); // Generate random ID
    this.peer.on('open', function(id) {
      // Confirm connection is ready
      this.dispatchPeerOpen(id, callback);

      // Connect to host
      var conn = this.peer.connect(host_id);

      // Add event listeners from host
      conn.on('open', function() { this.dispatchConnectionOpen(conn); }.bind(this)); // Add open listener
      conn.on('close', function() { this.dispatchConnectionClose(conn); }.bind(this)); // Add disconnection listener
      conn.on('data', function(data) { this.dispatchConnectionData(conn, data); }.bind(this)); // Add inbound data listener
      conn.on('error', function(error) { this.dispatchConnectionError(conn, error); }); // Add connection error listener
    }.bind(this));

    // Listen to peer errors
    this.peer.on('error', function(error){ this.dispatchPeerError(error); }.bind(this));
  }

  dispatchPeerOpen(id, callback = function(){}) {
    console.log('Client (' + this.peer.id + ') is ready to connect to a server');
    callback(id);
  }

  dispatchPeerError(error) {
    console.log('Client (' + this.peer.id + ') error: ', error);
  }

  dispatchConnectionOpen(conn) {
    console.log('Server (' + conn.peer + ') received client (' + this.peer.id + ')');
  }

  dispatchConnectionClose(conn) {
    console.log('Server (' + conn.peer + ') disconnected from client (' + this.peer.id + ')');
  }

  dispatchConnectionData(conn, data) {
    console.log('Server (' + conn.peer + ') sent data to client (' + this.peer.id + '): ', data);
  }

  dispatchConnectionError(conn, error) {
    console.log('Server (' + conn.peer + ') error: ', error);
  }
}

export { Client };