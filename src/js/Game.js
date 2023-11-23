import { Assets } from './Assets.js';
import { Loop } from './Loop';
import { Graphics } from './Graphics';
import { Physics } from './Physics';
import { WorldManager } from './WorldManager';

class Game {
  constructor() {
    this.assets = new Assets();
    this.loop = new Loop();
  }

  init(canvas) {
    this.physics = new Physics();
    this.physics.setFPS(30);
    this.graphics = new Graphics(canvas);
    this.graphics.camera.position.set(0, 0, 8);
    this.worldManager = new WorldManager(this.graphics.scene, this.physics.world);
    this.assets.load(function() {
      this.load();
    }.bind(this));
  }

  load() {
    // Add physics loop
    this.loop.add(30, function(data) {
      this.worldManager.updatePhysics(data);
      this.physics.step();
    }.bind(this));

    // Add graphic loop
    this.loop.add(-1, function(data) {
      this.worldManager.updateGraphics(data);
      this.graphics.render();
    }.bind(this));

    // Start loop
    this.loop.start();
  }
}

export { Game };