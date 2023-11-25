import { Sphere } from './Sphere';
import { TriMesh } from './TriMesh';
import { Sun } from '../Sun';

class WorldManager {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.bodies = [];
    this.debug = false;
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
      var type = mesh.name.includes('-Dynamic') ? 1 : 2;
      var triMesh = new TriMesh({ mesh: mesh, type: type });
      this.add(triMesh);
    }.bind(this));

    // Add random spheres
    for (var i = 0; i < 200; i++) {
      var x = (Math.random() * 20) - 10;
      var y = (Math.random() * 20);
      var z = (Math.random() * 20) - 10;
      var radius = (Math.random() * 0.5) + 0.5;
      var sphere = new Sphere({
        color: '#67d017',
        position: { x: x, y: y, z: z },
        radius: radius
      });
      this.add(sphere);
    }

    // Add sun to scene
    this.sun = new Sun();
    this.sun.update(10);
    this.scene.add(this.sun);
  }

  updatePhysics(data) {
    // Snapshot previous position/rotation for lerp
    
  }

  updateGraphics(data) {
    // Update sun orbit angle
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