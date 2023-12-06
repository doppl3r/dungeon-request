import { EntityDebugger } from './EntityDebugger';
import { Player } from './entities/Player';
import { Sphere } from './entities/Sphere';
import { TriMesh } from './entities/TriMesh';
import { Sun } from './Sun';

class EntityManager {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.entities = [];
    this.debugger = new EntityDebugger(scene, world);
    //this.debugger.disable();
  }

  runDemo() {
    // Add player
    var player = new Player({
      position: { x: 0, y: 2, z: 0 }
    });
    this.add(player);
    player.addEventListeners();

    // Add meshes from dungeon model
    var dungeon = game.assets.models.cache['test'];
    var meshes = [];
    dungeon.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        meshes.push(child);
      }
    });

    // Create TriMeshes from dungeon
    meshes.forEach(function(mesh) {
      var type = mesh.name.includes('-Dynamic') ? 'Dynamic' : 'Fixed';
      var triMesh = new TriMesh({ mesh: mesh, type: type });
      this.add(triMesh);
    }.bind(this));

    // Add random spheres
    for (var i = 0; i < 1; i++) {
      var x = (Math.random() * 12) - 6;
      var y = 4;
      var z = (Math.random() * 12) - 6;
      var radius = (Math.random() * 0.25) + 0.25;
      var rotation = Math.random() * Math.PI;
      var sphere = new Sphere({
        color: '#ffb547',
        position: { x: x, y: y, z: z },
        rotation: { x: rotation, y: rotation, z: rotation },
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
    // Update debugger buffer (optional if enabled)
    this.debugger.update();

    // Update all entities
    this.entities.forEach(function(child) {
        if (child.rigidBody) child.update(data.delta);
    });
  }

  updateGraphics(data) {
    // Update sun orbit angle
    this.sun.update(data.delta);

    // Lerp each body model position/rotation
    this.entities.forEach(function(child) {
      if (child.rigidBody) child.lerp(data.alpha);
    });
  }

  add(body) {
    this.entities.push(body);
    body.addToWorld(this.world);
    body.addToScene(this.scene);
  }

  remove(body) {
    var index = this.entities.indexOf(body);
    this.entities.splice(index, 1);
    body.removeFromWorld(this.world);
    body.removeFromScene(this.scene);
  }
}

export { EntityManager };