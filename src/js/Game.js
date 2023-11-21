import { OrthographicCamera, Scene, Vector3 } from 'three';
import { ColliderDesc, RigidBodyDesc, World } from '@dimforge/rapier3d';

class Game {
  constructor() {

  }

  init() {
    import('@dimforge/rapier3d').then(function(RAPIER) {
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
    
      // Game loop. Replace by your own game loop system.
      let gameLoop = () => {
        // Ste the simulation forward.  
        world.step();
    
        // Get and print the rigid-body's position.
        let position = rigidBody.translation();
        console.log("Rigid-body position: ", position.x, position.y, position.z);
    
        setTimeout(gameLoop, 16);
      };
    
      gameLoop();
    });
  }
}

export { Game };