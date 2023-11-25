import CannonDebugger from 'cannon-es-debugger';

class PhysicsDebugger {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.debugger = new CannonDebugger(this.scene, this.world, { color: '#ffff00', scale: 1 });;
  }

  update() {
    this.debugger.update();
  }
}

export { PhysicsDebugger };