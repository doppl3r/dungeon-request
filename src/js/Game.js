import { Assets } from './Assets.js';
import { Loop } from './Loop';
import { Graphics } from './Graphics';
import { Physics } from './Physics';
import { PhysicsDebugger } from './PhysicsDebugger';
import { WorldManager } from './WorldManager';
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
    this.graphics.camera.position.set(0, 10, 8);
    this.graphics.addOrbitControls({ x: 0, y: 0, z: 2 });
    this.physics = new Physics();
    this.physics.setFPS(30);

    this.worldManager = new WorldManager(this.graphics.scene, this.physics.world);
    this.assets.load(function() {
      this.load();
    }.bind(this));
  }

  load() {
    // Start demo world
    this.worldManager.runDemo();
    this.physicsDebugger = new PhysicsDebugger(this.graphics.scene, this.physics.world);

    // Add physics loop
    this.loop.add(this.physics.fps, function(data) {
      this.worldManager.updatePhysics(data);
      this.physics.step();
      //this.physicsDebugger.update()
    }.bind(this));

    // Add graphic loop
    this.loop.add(-1, function(data) {
      this.stats.begin();
      this.worldManager.updateGraphics(data);
      this.graphics.render();
      this.stats.end();
    }.bind(this));

    // Start loop
    this.loop.start();
  }
}

export { Game };