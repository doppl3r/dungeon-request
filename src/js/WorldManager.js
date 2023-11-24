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
    // Add meshes from dungeon model
    var dungeon = game.assets.models.cache['dungeon'];
    var meshes = [];
    dungeon.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material
        meshes.push(child);
      }
    });

    // Create TriMeshes from dungeon
    meshes.forEach(function(mesh) {
      var type = mesh.name.includes('-Dynamic') ? 'Dynamic' : 'Fixed';
      var triMesh = new TriMesh({ mesh: mesh, type: type });
      this.add(triMesh);
    }.bind(this));

    // Add random cubes
    for (var i = 0; i < 100; i++) {
      var x = (Math.random() * 20) - 10;
      var y = (Math.random() * 20);
      var z = (Math.random() * 20) - 10;
      var scale = (Math.random() * 0.5) + 0.5;
      var rotation = Math.random() * Math.PI;
      var cuboid = new Cuboid({
        color: '#67d017',
        position: { x: x, y: y, z: z },
        rotation: { x: rotation, y: rotation, z: rotation },
        size: { x: scale, y: scale, z: scale },
        scene: this.scene,
        world: this.world
      });
      this.add(cuboid);
    }

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