import { Cube } from './Cube';
import { Sun } from './Sun';

class WorldManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
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
            scene: this.scene,
            world: this.world
        });
        this.add(this.ground);
    
        // Cube 1
        this.cube_1 = new Cube({
            position: { x: -0.5, y: 5, z: 0.5 },
            rotation: { x: -0.5, y: 0, z: -0.5 },
            size: { x: 1, y: 1, z: 1 },
            scene: this.scene,
            world: this.world
        });
        this.add(this.cube_1);
        
        // Cube 2
        this.cube_2 = new Cube({
            position: { x: 0, y: 2, z: 0 },
            rotation: { x: 0.5, y: 0, z: 0.5 },
            size: { x: 3, y: 3, z: 3 },
            scene: this.scene,
            world: this.world
        });
        this.add(this.cube_2);
    
        // Add sun to scene
        this.sun = new Sun();
        this.sun.update(10);
        this.scene.add(this.sun);
    }

    updatePhysics(data) {
        this.cube_1.takeSnapshot();
        this.cube_2.takeSnapshot();
    }

    updateGraphics(data) {
        this.sun.update(data.delta);
        this.cube_1.lerp(data.alpha);
        this.cube_2.lerp(data.alpha);
    }

    add(body) {
        body.addToWorld(this.world);
        body.addToScene(this.scene);
    }
}

export { WorldManager };