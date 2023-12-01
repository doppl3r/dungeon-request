import { World } from '@dimforge/rapier3d';

class Physics {
  constructor() {
    this.gravity = { x: 0.0, y: -9.81, z: 0.0 };
    this.world = new World(this.gravity);
    this.setTick(60);
  }

  setTick(tick = 60) {
    this.tick = tick;
    this.setTimestep(1 / tick);
  }

  setTimestep(timestep = 1 / 60) {
    this.world.timestep = timestep;
  }

  update(data) {
    this.step();
  }

  step() {
    this.world.step();
  }
}

export { Physics };