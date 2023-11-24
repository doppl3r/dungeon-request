import { Body } from './Body';
import { Cuboid } from './Cuboid';
import { TriMesh } from './TriMesh';
import { Sun } from './Sun';

class WorldManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.bodies = [];
    }

    runDemo() {
        // Dungeon trimesh
        var dungeon = new TriMesh({ mesh: game.assets.models.cache['dungeon-6'].children[1] });
        this.add(dungeon);
    
        // Cuboid 1
        var cuboid_1 = new Cuboid({
            position: { x: -4, y: 5, z: 4 },
            rotation: { x: -0.5, y: 0, z: -0.5 },
            size: { x: 1, y: 1, z: 1 },
            scene: this.scene,
            world: this.world
        });
        this.add(cuboid_1);
        
        // Cuboid 2
        var cuboid_2 = new Cuboid({
            position: { x: 4, y: 5, z: 2 },
            rotation: { x: 0.5, y: 0, z: 0.5 },
            size: { x: 3, y: 3, z: 3 },
            scene: this.scene,
            world: this.world
        });
        this.add(cuboid_2);
    
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