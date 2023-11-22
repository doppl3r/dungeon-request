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
    this.graphics.camera.position.set(0, 1, 5);
    this.assets.load(function() {
      this.load();
    }.bind(this));
  }

  load() {
    // Ground
    var ground = new Cube({
      type: 'Fixed',
      position: { x: 0, y: -1, z: 0 },
      size: { x: 10, y: 0.2, z: 10 },
      color: '#dc265a',
      scene: this.graphics.scene,
      world: this.physics.world
    });

    // Cube 1
    var cube_2 = new Cube({
      position: { x: 0, y: 1, z: 0 },
      size: { x: 1, y: 1, z: 1 },
      scene: this.graphics.scene,
      world: this.physics.world
    });

    // Cube 2
    var cube_1 = new Cube({
      position: { x: -0.5, y: 5, z: 0.5 },
      size: { x: 1, y: 1, z: 1 },
      scene: this.graphics.scene,
      world: this.physics.world
    });

    // Add sun to scene
    this.sun = new Sun();
    this.graphics.scene.add(this.sun);

    // Add physics loop
    this.loop.add(20, function(data) {
      this.physics.world.step();
      cube_1.position.copy(cube_1.body.translation());
      cube_1.quaternion.copy(cube_1.body.rotation());
      cube_2.position.copy(cube_2.body.translation());
      cube_2.quaternion.copy(cube_2.body.rotation());
    }.bind(this));

    // Add render loop
    this.loop.add(-1, function(data) {
      this.sun.update(data.delta);
      this.graphics.render();
    }.bind(this));

    // Start loop
    this.loop.start();
  }
}

export { Game };