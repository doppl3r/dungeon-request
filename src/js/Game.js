import { BoxGeometry, Mesh, MeshStandardMaterial, OrthographicCamera, Scene, Vector3 } from 'three';
import { ColliderDesc, RigidBodyDesc, World } from '@dimforge/rapier3d';
import { Assets } from './Assets.js';
import { Loop } from './Loop';
import { Graphics } from './Graphics';
import { Sun } from './Sun.js';

class Game {
  constructor() {
    this.assets = new Assets();
    this.loop = new Loop();
  }

  init(canvas) {
    this.graphics = new Graphics(canvas);
    this.graphics.camera.position.set(0, 1, 5);
    this.assets.load(function() {
      this.load();
    }.bind(this));
  }

  load() {
    import('@dimforge/rapier3d').then(function() {
      // Use the RAPIER module here.
      var gravity = { x: 0.0, y: -9.81, z: 0.0 };
      var world = new World(gravity);
      var groundColliderDesc = ColliderDesc.cuboid(5.0, 0.1, 5.0);
      world.createCollider(groundColliderDesc);

      // Add Three.js ground
      var geometry = new BoxGeometry(10, 0.2, 10);
      var material = new MeshStandardMaterial({ color: '#dc265a' });
      var ground = new Mesh(geometry, material);
      ground.receiveShadow = true;
      ground.castShadow = true;
      this.graphics.scene.add(ground);
    
      // Create a dynamic rigid-body.
      var cubeBodyOneDesc = RigidBodyDesc.dynamic().setTranslation(0.0, 5.0, 0.0);
      var cubeBodyOne = world.createRigidBody(cubeBodyOneDesc);
      var cubeColliderOneDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5);
      var cubeColliderOne = world.createCollider(cubeColliderOneDesc, cubeBodyOne);

      // Add Three.js cube 1
      var geometry = new BoxGeometry(1, 1, 1);
      var material = new MeshStandardMaterial({ color: '#338ccc' });
      var cube_1 = new Mesh(geometry, material);
      cube_1.receiveShadow = true;
      cube_1.castShadow = true;
      this.graphics.scene.add(cube_1);

      // Create a dynamic rigid-body.
      var cubeBodyTwoDesc = RigidBodyDesc.dynamic().setTranslation(-0.5, 7.0, 0.5);
      var cubeBodyTwo = world.createRigidBody(cubeBodyTwoDesc);
      var cubeColliderTwoDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5);
      var cubeColliderTwo = world.createCollider(cubeColliderTwoDesc, cubeBodyTwo);

      // Add Three.js cube 2
      var geometry = new BoxGeometry(1, 1, 1);
      var material = new MeshStandardMaterial({ color: '#338ccc' });
      var cube_2 = new Mesh(geometry, material);
      cube_2.receiveShadow = true;
      cube_2.castShadow = true;
      this.graphics.scene.add(cube_2);

      // Add sun to scene
      this.sun = new Sun();
      this.graphics.scene.add(this.sun);

      console.log(cubeBodyOne);

      // Add physics loop
      this.loop.add(30, function(data) {
        world.step();
        cube_1.position.copy(cubeBodyOne.translation());
        cube_1.quaternion.copy(cubeBodyOne.rotation());
        cube_2.position.copy(cubeBodyTwo.translation());
        cube_2.quaternion.copy(cubeBodyTwo.rotation());
      });

      // Add render loop
      this.loop.add(-1, function(data) {
        this.sun.update(data.delta);
        this.graphics.render();
      }.bind(this));

      // Start loop
      this.loop.start();
    }.bind(this));
  }
}

export { Game };