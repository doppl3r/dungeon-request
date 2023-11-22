import { World } from '@dimforge/rapier3d';

class Physics {
    constructor() {
        this.gravity = { x: 0.0, y: -9.81, z: 0.0 };
        this.world = new World(this.gravity);
    }
}

export { Physics };