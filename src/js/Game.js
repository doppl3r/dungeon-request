import { Assets } from './Assets.js';
import { Loop } from './Loop';
import { Graphics } from './Graphics';
import { Physics } from './Physics';
import { Cube } from './Cube';
import { Sun } from './Sun.js';

class Game {
  constructor() {
    this.assets = new Assets();
    this.physics = new Physics();
    this.loop = new Loop();
  }

  init(canvas) {
    this.graphics = new Graphics(canvas);
    this.graphics.camera.position.set(0, 0, 8);
    this.assets.load(function() {
      this.load();
    }.bind(this));
  }

  load() {
    // Ground
    var ground = new Cube({
      type: 'Fixed',
      position: { x: 0, y: -1, z: 0 },
      rotation: { x: 0.3, y: 0, z: -0.3 },
      size: { x: 10, y: 0.2, z: 10 },
      color: '#dc265a',
      scene: this.graphics.scene,
      world: this.physics.world
    });

    // Cube 1
    var cube_1 = new Cube({
      position: { x: -0.5, y: 5, z: 0.5 },
      rotation: { x: -0.5, y: 0, z: -0.5 },
      size: { x: 1, y: 1, z: 1 },
      scene: this.graphics.scene,
      world: this.physics.world
    });
    
    // Cube 2
    var cube_2 = new Cube({
      position: { x: 0, y: 2, z: 0 },
      rotation: { x: 0.5, y: 0, z: 0.5 },
      size: { x: 3, y: 3, z: 3 },
      scene: this.graphics.scene,
      world: this.physics.world
    });

    // Add sun to scene
    this.sun = new Sun();
    this.sun.update(10);
    this.graphics.scene.add(this.sun);

    // Add physics loop
    this.physics.setFPS(30);
    this.loop.add(30, function(data) {
      cube_1.takeSnapshot();
      cube_2.takeSnapshot();
      this.physics.world.step();
    }.bind(this));

    // Add render loop
    this.loop.add(-1, function(data) {
      this.sun.update(data.delta);
      cube_1.lerp(data.alpha);
      cube_2.lerp(data.alpha);

      this.graphics.render();
    }.bind(this));

    // Start loop
    this.loop.start();
  }
}

export { Game };