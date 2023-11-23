import { Graphics } from './Graphics';
import { Physics } from './Physics';
import { Cube } from './Cube';
import { Sun } from './Sun';

class WorldManager {
    constructor(canvas) {
        this.physics = new Physics();
        this.graphics = new Graphics(canvas);
        this.graphics.camera.position.set(0, 0, 8);
        this.physics.setFPS(30);
        this.runDemo();
    }

    runDemo() {
        // Ground
        this.ground = new Cube({
            type: 'Fixed',
            position: { x: 0, y: -1, z: 0 },
            rotation: { x: 0.3, y: 0, z: -0.3 },
            size: { x: 10, y: 0.2, z: 10 },
            color: '#dc265a',
            scene: this.graphics.scene,
            world: this.physics.world
        });
    
        // Cube 1
        this.cube_1 = new Cube({
            position: { x: -0.5, y: 5, z: 0.5 },
            rotation: { x: -0.5, y: 0, z: -0.5 },
            size: { x: 1, y: 1, z: 1 },
            scene: this.graphics.scene,
            world: this.physics.world
        });
        
        // Cube 2
        this.cube_2 = new Cube({
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
    }

    updatePhysics(data) {
        this.cube_1.takeSnapshot();
        this.cube_2.takeSnapshot();
        this.physics.world.step();
    }

    updateGraphics(data) {
        this.sun.update(data.delta);
        this.cube_1.lerp(data.alpha);
        this.cube_2.lerp(data.alpha);
        this.graphics.render();
    }

    add(body) {

    }
}

export { WorldManager };