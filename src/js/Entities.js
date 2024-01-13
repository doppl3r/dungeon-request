import { TriMesh } from './entities/TriMesh';

class Entities {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.list = [];
  }

  updateBodies(delta) {
    // Update all entities
    this.list.forEach(function(child) {
        if (child.body) child.updateBody(delta);
    });
  }

  updateObjects(delta, alpha) {
    // Update each 3D object
    this.list.forEach(function(child) {
      if (child.body) child.updateObject(delta, alpha);
    });
  }

  add(body) {
    this.list.push(body);
    body.addToWorld(this.world);
    body.addToScene(this.scene);
  }

  addTriMesh(mesh) {
    // Create TriMeshes from dungeon
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
  }

  remove(body) {
    var index = this.list.indexOf(body);
    this.list.splice(index, 1);
    body.removeFromWorld(this.world);
    body.removeFromScene(this.scene);
  }

  toJSON() {
    var json = [];
    for (var i = 0; i < this.list.length; i++) {
      var entity = this.list[i];
      json.push(entity.toJSON());
    }
    return json;
  }
}

export { Entities };