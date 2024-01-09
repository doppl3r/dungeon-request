import { Client } from './Client.js';
import { Server } from './Server.js';

class Network {
  constructor() {
    this.setTick(10);
    this.client = new Client();
    this.server = new Server();
  }

  update(delta) {
    
  }

  host(id_host, callback = function(){}) {
    // Host server
    this.server.host(id_host, function(id) { callback(id); });
  }

  join(id_host, callback = function(){}) {
    // Join server
    this.client.join(id_host, function(id) { callback(id); });
  }

  setTick(tick = 10) {
    this.tick = tick;
  }
}

export { Network };