import { Assets } from './Assets.js';
import { Loop } from './Loop';
import { WorldManager } from './WorldManager';

class Game {
  constructor() {
    this.assets = new Assets();
    this.loop = new Loop();
  }

  init(canvas) {
    this.worldManager = new WorldManager(canvas);
    this.assets.load(function() {
      this.load();
    }.bind(this));
  }

  load() {
    // Add physics loop
    this.loop.add(30, function(data) {
      this.worldManager.updatePhysics(data);
    }.bind(this));

    // Add graphic loop
    this.loop.add(-1, function(data) {
      this.worldManager.updateGraphics(data);
    }.bind(this));

    // Start loop
    this.loop.start();
  }
}

export { Game };