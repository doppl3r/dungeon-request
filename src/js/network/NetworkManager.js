import { Client } from './Client.js';
import { Server } from './Server.js';

/*
  A network manager has both a client and server. Game logic is
  handled by the server and is synchronized to the local client.
*/

class NetworkManager {
  constructor(canvas) {
    this.client = new Client(canvas);
    this.server = new Server();
  }

  load(assets) {
    // Load server and client assets
    this.server.load(assets);
    this.client.load(assets);

    // Open local connections
    this.server.open();
    this.client.open();

    // Connect local client to local server
    this.client.connect(this.server.peer.id);

    // Add server open listener
    /* this.server.on('peer_open', function(se) {
      // Open client connection
      this.client.open();
      
      // Add client open listener
      this.client.on('peer_open', function(ce) {
        // Immediately connect client to server
        this.client.connect(se.id);
      }.bind(this));
    }.bind(this));
    
    // Open server connection
    this.server.open(); */
  }

  update(delta) {
    this.server.update(delta);
  }
}

export { NetworkManager };