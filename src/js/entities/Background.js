import { AmbientLight, BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from 'three';
import { Entity } from './Entity.js';

class Background extends Entity {
  constructor(options) {
    // Resolve null option values
    if (options.color == null) options.color = '#ffffff';
    if (options.radius == null) options.radius = 10;
    if (options.widthSegments == null) options.widthSegments = 16;
    if (options.heightSegments == null) options.heightSegments = 16;
    if (options.type == null) options.type = 'KinematicPositionBased';

    // Inherit Entity class
    super(options);
    this.name = 'Background';
    
    // Initialize with options
    var geometry = new SphereGeometry(options.radius, 16, 16);

    // Update bounding box for shader material
    geometry.computeBoundingBox();

    // Configure shader material gradient
    var material = new ShaderMaterial({
      uniforms: {
        top: {  value: new Color("#F65510") },
        bottom: { value: new Color("#291013") },
        min: { value: geometry.boundingBox.min },
        max: { value: geometry.boundingBox.max },
        scale: { value: 0.125 }
      },
      vertexShader: `
        uniform vec3 min;
        uniform vec3 max;
        varying vec2 vUv;
        void main() {
          vUv.y = (position.y - min.y) / (max.y - min.y);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 bottom;
        uniform vec3 top;
        uniform float scale;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(bottom, top, smoothstep(0.5 - (scale / 2.0), 0.5 + (scale / 2.0), vUv.y)), 1.0);
        }
      `,
      side: BackSide
    });
    
    // Add mesh and light to object
    var mesh = new Mesh(geometry, material);
    var ambientLight = new AmbientLight(options.color, 1 * Math.PI);
    this.object.add(mesh, ambientLight);
  }

  updateObject(delta, alpha) {
    // Call Character update function
    super.updateObject(delta, alpha);
  }
}

export { Background };