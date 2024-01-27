import { Assets } from './Assets.js';
import { Loop } from './Loop';
import { Client } from './Client.js';
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

    // Load game after assets have loaded
    this.assets.load(function() {
      this.load(this.assets);
    }.bind(this));
  }

  load(assets) {
    // Initialize client environment
    this.client.init(this.assets);
    this.client.session.loadWorld(assets)

    // Add physics loop
    this.loop.add(30, function(data) {
      this.client.updateBodies(data.delta);
      this.client.physics.step(); // Perform world calculation
    }.bind(this));

    // Add graphic loop
    this.loop.add(-1, function(data) {
      this.stats.begin(); // Start FPS counter
      this.client.updateObjects(data.delta, data.alpha);
      this.stats.end(); // Complete FPS counter
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