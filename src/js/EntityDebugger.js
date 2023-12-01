import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three';

/*
  The Physics Debugger provides 3D lines to the scene from the physics world buffer.
*/

class EntityDebugger extends LineSegments {
  constructor(scene, world) {
    super();
    this.scene = scene;
    this.world = world;
    this.material = new LineBasicMaterial({ color: 0xffffff, vertexColors: true });
    this.geometry =  new BufferGeometry();
    this.scene.add(this);
    this.enabled = true;
  }

  update() {
    if (this.visible == true) {
      this.visible = true;
      this.buffers = this.world.debugRender();
      this.geometry.setAttribute('position', new BufferAttribute(this.buffers.vertices, 3));
      this.geometry.setAttribute('color', new BufferAttribute(this.buffers.colors, 4));
    }
  }

  enable() {
    this.visible = true;
  }

  disable() {
    this.visible = false;
  }
}

export { EntityDebugger };