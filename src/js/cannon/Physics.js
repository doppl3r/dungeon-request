import { World } from 'cannon-es';

class Physics {
  constructor() {
    this.world = new World({
      allowSleep: true,
      gravity: { x: 0.0, y: -9.81, z: 0.0 }
    });
    this.fps = 60;
  }

  setFPS(fps = 60) {
    this.fps = fps;
  }

  step() {
    this.world.step(1 / this.fps);
  }
}

export { Physics };