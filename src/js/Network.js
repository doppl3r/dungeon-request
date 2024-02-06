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

    // Add server open listener
    this.server.on('peer_open', function(se) {
      // Open client connection
      this.client.open();
      
      // Add client open listener
      this.client.on('peer_open', function(ce) {
        // Immediately connect client to server
        this.client.connect(se.id);
      }.bind(this));
    }.bind(this));
    
    // Open server connection
    this.server.open();
  }

  update(delta) {
    this.server.update(delta);
  }
}

export { Network };