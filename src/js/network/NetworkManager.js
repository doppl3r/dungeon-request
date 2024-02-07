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
    
    // Open server connection
    this.client.open();
    this.server.open();

    // Assign local connections
    this.client.connect(this.server);
    this.server.connect(this.client);
  }

  connect(id) {
    // Clear local server before connecting client to remove peer
    this.server.connections.clear();
    this.server.link = null;
    this.client.link = null;
    this.client.connect(id);
  }

  update(delta) {
    this.server.update(delta);
  }
}

export { NetworkManager };