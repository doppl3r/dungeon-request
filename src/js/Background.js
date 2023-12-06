import { BackSide, Color, Group, Mesh, ShaderMaterial, SphereGeometry } from 'three';

class Background extends Group {
	constructor(options) {
		super();

		// Merge options
		options = Object.assign({
			name: 'background',
			position: { x: 0, y: 0, z: 0 },
			radius: 1
		}, options);
		
		// Initialize with options
		this.options = options; // Store for getOptions for pre-mesh transformations
		this.init(options);
	}

	init(options) {
		// Empty existing meshes
		this.clear();

		// Assign default values
		this.name = options.name;

		// Add sphereMesh
		this.addSphereMesh();
	}

	update(delta, alpha) {
		this.rotation.y += delta * 0.01;
	}

	addSphereMesh() {
		var geometry = new SphereGeometry(this.options.radius, 16, 16);

		// Update bounding box for shader material
		geometry.computeBoundingBox();

		// Configure shader material gradient
		var material = new ShaderMaterial({
			uniforms: {
				top: {  value: new Color("#7fc9ff") },
				bottom: { value: new Color("#ffffff") },
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
		
		// Copy options position and return mesh
		var mesh = new Mesh(geometry, material);
		mesh.position.set(this.options.position.x, this.options.position.y, this.options.position.z);
		mesh.name = 'background-mesh';
		this.add(mesh);
	}

	setTarget(target) {
		this.target = target;
	}
}

export { Background };