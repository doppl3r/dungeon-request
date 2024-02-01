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
    this.server.connector.on('peer_open', function(e) {
      console.log(e);
    }.bind(this));

    this.server.connector.on('connection_open', function(e) {
      console.log(e);
    }.bind(this));

    this.server.connector.on('connection_close', function(e) {
      console.log(e);
    }.bind(this));

    this.server.connector.on('connection_data', function(e) {
      console.log(e);
    }.bind(this));

    




    // Add client event listeners
    this.client.connector.on('peer_open', function(e) {
      console.log(e);
    }.bind(this));

    this.client.connector.on('connection_open', function(e) {
      console.log(e);
    }.bind(this));

    this.client.connector.on('connection_close', function(e) {
      console.log(e);
    }.bind(this));

    this.client.connector.on('connection_data', function(e) {
      console.log(e);
    }.bind(this));


    
    
    // Open server to start local connection
    this.server.connector.open();
    this.client.connector.open();
  }

  update(delta) {
    this.server.updateConnections();
  }
}

export { Network };