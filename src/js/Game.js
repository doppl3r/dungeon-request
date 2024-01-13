import { Assets } from './Assets.js';
import { Loop } from './Loop';
import { Graphics } from './Graphics';
import { Physics } from './Physics';
import { Debugger } from './Debugger.js';
import { Network } from './Network.js';
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
    this.graphics = new Graphics(canvas);
    this.graphics.setTick(-1);
    this.graphics.setShadows(false);
    this.physics = new Physics();
    this.physics.setTick(30);
    this.debugger = new Debugger(this.graphics.scene, this.physics.world);
    this.debugger.disable();
    this.network = new Network();
    this.network.setTick(10);
    this.client = new Client(this.graphics.scene, this.physics.world);
    this.server = new Server();

    // Load game after assets have loaded
    this.assets.load(function() {
      this.load(this.assets);
    }.bind(this));
  }

  load(assets) {
    // Create a server
    this.server.host('dungeon-request-local', function(id) {
      // Load server session
      this.server.session.loadWorld(assets)
      
      // Join server
      this.client.join(id, function() {
        // Initialize client environment
        this.client.init(this.assets);
        this.client.session.loadWorld(assets)
        
        // Set camera to player camera
        this.graphics.setCamera(this.client.player.camera);
        this.graphics.setSelectedObjects([this.client.player.model]);
      }.bind(this));
    }.bind(this));

    // Add physics loop
    this.loop.add(this.physics.tick, function(data) {
      this.server.updateBodies(data.delta);
      this.client.updateBodies(data.delta);

      
      this.physics.step(); // Perform world calculation
      this.debugger.update(); // Update debugger buffer
    }.bind(this));

    // Add graphic loop
    this.loop.add(this.graphics.tick, function(data) {
      this.stats.begin(); // Start FPS counter

      this.server.updateObjects(data.delta, data.alpha);
      this.client.updateObjects(data.delta, data.alpha);

      this.graphics.update(data.delta); // Update 3D engine
      this.stats.end(); // Complete FPS counter
    }.bind(this));

    // Add network loop
    this.loop.add(this.network.tick, function(data) {
      this.server.update(data.delta);
    }.bind(this));

    // Start loop
    this.loop.start();
  }
}

export { Game };