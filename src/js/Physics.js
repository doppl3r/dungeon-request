import { World } from '@dimforge/rapier3d';

class Physics {
    constructor() {
        this.gravity = { x: 0.0, y: -9.81, z: 0.0 };
        this.world = new World(this.gravity);
        this.fps = 60;
    }

    setFPS(fps = 60) {
        this.fps = fps;
        this.setTimestep(1 / fps);
    }

    setTimestep(timestep = 1 / 60) {
        this.world.timestep = timestep;
    }

    step() {
        this.world.step();
    }
}

export { Physics };