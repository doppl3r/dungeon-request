import { OrthographicCamera, Scene, Vector3 } from 'three';
import { ColliderDesc, RigidBodyDesc, World } from '@dimforge/rapier3d';
import { Loop } from './Loop';

class Game {
  constructor() {
    this.loop = new Loop();
  }

  init() {
    var _this = this;
    import('@dimforge/rapier3d').then(function() {
      // Use the RAPIER module here.
      let gravity = { x: 0.0, y: -9.81, z: 0.0 };
      let world = new World(gravity);
    
      // Create the ground
      let groundColliderDesc = ColliderDesc.cuboid(10.0, 0.1, 10.0);
      world.createCollider(groundColliderDesc);
    
      // Create a dynamic rigid-body.
      let rigidBodyDesc = RigidBodyDesc.dynamic().setTranslation(0.0, 1.0, 0.0);
      let rigidBody = world.createRigidBody(rigidBodyDesc);
    
      // Create a cuboid collider attached to the dynamic rigidBody.
      let colliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5);
      let collider = world.createCollider(colliderDesc, rigidBody);

      // Add physics loop
      _this.loop.add(30, function(data) {
        world.step();
        let position = rigidBody.translation();
        //console.log("Rigid-body position: ", position.x, position.y, position.z);
        console.log('physic loop', data);
      });

      // Add render loop
      _this.loop.add(-1, function(data) {
        console.log('render loop', data);
      });

      // Start loop
      _this.loop.start();
    });
  }
}

export { Game };