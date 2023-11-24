import { Body } from './Body';
import { Cube } from './Cube';
import { Sun } from './Sun';

class WorldManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.bodies = [];
        this.runDemo();
    }

    runDemo() {
        // Ground
        this.dungeon = new Body();
    
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
        // Snapshot previous position/rotation for lerp
        this.bodies.forEach(function(child) {
            if (child.rigidBody) child.takeSnapshot();
        });
    }

    updateGraphics(data) {
        this.sun.update(data.delta);

        // Lerp each body model position/rotation
        this.bodies.forEach(function(child) {
            if (child.rigidBody) child.lerp(data.alpha);
        });
    }

    add(body) {
        this.bodies.push(body);
        body.addToWorld(this.world);
        body.addToScene(this.scene);
    }
}

export { WorldManager };