import { Assets } from './Assets.js';
import { Client } from './Client.js';
import { Debugger } from './Debugger.js';
import { Loop } from './Loop';
import { Server } from './Server.js';
import Stats from './Stats.js';

class Game {
  constructor() {
    this.assets = new Assets();
    this.loop = new Loop();
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  init(canvas) {
    // Create network event system
    this.client = new Client(canvas);
    this.server = new Server();

    // Load game after assets have loaded
    this.assets.load(function() { this.load(this.assets); }.bind(this));
  }

  load(assets) {
    // Initialize server and client
    this.server.init(assets);
    this.client.init(assets);

    // Start server
    this.server.network.open();

    // Add game debugger
    this.debugger = new Debugger(this.client.graphics.scene, this.server.physics.world);
    this.debugger.disable();

    // Add physics loop
    this.loop.add(30, function(data) {
      // Update server and client bodies
      this.server.updateBodies(data.delta);
      this.client.updateBodies(data.delta);

      // Update debugger buffer
      this.debugger.update();
    }.bind(this));

    // Add graphic loop
    this.loop.add(-1, function(data) {
      // Start FPS counter
      this.stats.begin();

      // Update server and client instances
      this.server.updateObjects(data.delta, data.alpha);
      this.client.updateObjects(data.delta, data.alpha);

      // Complete FPS counter
      this.stats.end();
    }.bind(this));

    // Add network loop
    this.loop.add(10, function(data) {
      // TODO: Send server data to clients
    }.bind(this));

    // Start loop
    this.loop.start();
  }
}

export { Game };