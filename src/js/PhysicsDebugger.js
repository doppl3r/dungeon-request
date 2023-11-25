import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three';

class PhysicsDebugger extends LineSegments {
  constructor(scene, world) {
    super();
    this.scene = scene;
    this.world = world;
    this.material = new LineBasicMaterial({ color: 0xffffff, vertexColors: true });
    this.geometry =  new BufferGeometry();
    this.scene.add(this);
  }

  update() {
    this.buffers = this.world.debugRender();
    this.geometry.setAttribute('position', new BufferAttribute(this.buffers.vertices, 3));
    this.geometry.setAttribute('color', new BufferAttribute(this.buffers.colors, 4));
  }
}

export { PhysicsDebugger };