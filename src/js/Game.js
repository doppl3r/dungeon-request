import { Assets } from './Assets.js';
import { Debugger } from './Debugger.js';
import { Loop } from './Loop';
import { Network } from './Network.js';
import Stats from './Stats.js';

class Game {
  constructor() {
    this.assets = new Assets();
    this.loop = new Loop();
    this.stats = new Stats();
    this.debugger;
    this.network;

    // For testing: Attach stats to dom
    document.body.appendChild(this.stats.dom);
  }

  init(canvas) {
    // Create network event system
    this.network = new Network(canvas);

    // Load game after assets have loaded
    this.assets.load(function() { this.load(this.assets); }.bind(this));
  }

  load(assets) {
    // Load network with assets
    this.network.load(assets);

    // Add game debugger
    this.debugger = new Debugger(this.network.client.graphics.scene, this.network.server.physics.world);
    this.debugger.disable();

    // Add physics loop
    this.loop.add(30, function(data) {
      // Update server and client bodies
      this.network.server.updateBodies(data.delta);
      this.network.client.updateBodies(data.delta);

      // Update debugger buffer
      this.debugger.update();
    }.bind(this));

    // Add graphic loop
    this.loop.add(-1, function(data) {
      // Start FPS counter
      this.stats.begin();

      // Update server and client instances
      this.network.server.updateObjects(data.delta, data.alpha);
      this.network.client.updateObjects(data.delta, data.alpha);

      // Complete FPS counter
      this.stats.end();
    }.bind(this));

    // Add network loop
    this.loop.add(10, function(data) {
      this.network.update(data.delta);
    }.bind(this));

    // Start loop
    this.loop.start();
  }
}

export { Game };