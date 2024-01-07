import { Player } from './entities/Player';
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
    var player = this.player = new Player({
      color: '#f65510',
      position: { x: 0, y: 1, z: 0 },
      height: 0.5,
      radius: 0.25,
      model: model
    });
    this.add(player);
    model.play('Idle', 0);
    player.addEventListeners();

    // Set camera to player camera
    game.graphics.setCamera(player.camera);
    game.graphics.setSelectedObjects([player.model]);

    // Add meshes from dungeon model
    var dungeon = game.assets.models.cache['dungeon-crypt'];
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
        if (child.body) child.updateBody(delta);
    });
  }

  updateObjects(delta, alpha) {
    // Update sun orbit angle
    this.sun.update(delta);

    // Update each 3D object
    this.entities.forEach(function(child) {
      if (child.body) child.updateObject(delta, alpha);
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

  toJSON() {
    var json = {
      entities: []
    };
    for (var i = 0; i < this.entities.length; i++) {
      var entity = this.entities[i];
      json.entities.push(entity.toJSON());
    }
    return json;
  }
}

export { EntityManager };