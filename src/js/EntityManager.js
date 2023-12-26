import { Player } from './entities/Player';
import { Sphere } from './entities/Sphere';
import { TriMesh } from './entities/TriMesh';
import { Background } from './Background';
import { Sun } from './Sun';

class EntityManager {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.entities = [];
  }

  runDemo() {
    // Add player
    var model = game.assets.models.duplicate('player');
    var player = new Player({
      color: '#f65510',
      position: { x: 0, y: 6, z: 0 },
      height: 0.5,
      radius: 0.25,
      model: model
    });
    this.add(player);
    model.play('Run');
    player.addEventListeners();

    // Set camera to player camera
    game.graphics.setCamera(player.camera);
    game.graphics.setSelectedObjects([player.model]);

    // Add meshes from dungeon model
    var dungeon = game.assets.models.cache['dungeon-forge'];
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
      var type = 'Fixed'; // Rapier RigidBody type
      var name = mesh.name;
      var isDynamic = name.includes('-Dynamic');
      var isSensor = name.includes('-Sensor');
      if (isDynamic == true) type = 'Dynamic';
      var triMesh = new TriMesh({
        isSensor: isSensor,
        mesh: mesh,
        group: 0,
        type: type
      });
      this.add(triMesh);
    }.bind(this));

    // Add random spheres
    for (var i = 0; i < 4; i++) {
      var x = (Math.random() * 12) - 6;
      var y = 12;
      var z = (Math.random() * 12) - 6;
      var radius = (Math.random() * 0.25) + 0.25;
      var rotation = Math.random() * Math.PI;
      var sphere = new Sphere({
        color: '#f65510', // orange: #ffb547, blue: #7fc9ff
        position: { x: x, y: y, z: z },
        rotation: { x: rotation, y: rotation, z: rotation },
        radius: radius
      });
      this.add(sphere);
    }

    // Add background
    this.background = new Background({ radius: 50 });
    this.scene.add(this.background);

    // Add sun to scene
    this.sun = new Sun();
    this.sun.update(36);
    this.scene.add(this.sun);
  }

  updateBodies(delta) {
    // Update all entities
    this.entities.forEach(function(child) {
        if (child.rigidBody) child.updateBody(delta);
    });
  }

  updateObjects(delta, alpha) {
    // Update sun orbit angle
    this.sun.update(delta);

    // Update each 3D object
    this.entities.forEach(function(child) {
      if (child.rigidBody) child.updateObject(delta, alpha);
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