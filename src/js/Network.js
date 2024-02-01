import { Client } from './Client.js';
import { Server } from './Server.js';

/*
  A network has both a client and server. Game logic is handled by the
  server and is synchronized to the local client.
*/

class Network {
  constructor(canvas) {
    this.client = new Client(canvas);
    this.server = new Server();
  }

  load(assets) {
    // Load server and client assets
    this.server.load(assets);
    this.client.load(assets);

    // Add server event listeners
    this.server.on('peer_open', function(e) {
      console.log(e);
    }.bind(this));

    this.server.on('connection_open', function(e) {

    });

    // Add client event listeners
    this.client.on('peer_open', function(e) {
      console.log(e);
    }.bind(this));

    this.client.on('connection_open', function(e) {
      console.log(e);
    })
    
    // Open server to start local connection
    this.server.open();
    this.client.open();
  }

  update(delta) {
    
  }
}

export { Network };