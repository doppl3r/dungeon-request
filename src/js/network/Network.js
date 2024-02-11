import { Client } from './Client.js';
import { Server } from './Server.js';

/*
  A network manages a local client and server system. Game logic
  is handled by the server and is synchronized to connected clients.
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
    this.server.localConnection = null;
    this.client.localConnection = null;
    this.client.connect(id);
  }

  update(delta) {
    this.server.updateConnections(delta);
  }

  updateBodies(delta) {
    this.server.updateBodies(delta);
    this.client.updateBodies(delta);
  }

  updateObjects(delta, alpha) {
    this.server.updateObjects(delta, alpha);
    this.client.updateObjects(delta, alpha);
  }
}

export { Network };