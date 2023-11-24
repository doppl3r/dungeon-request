import { AmbientLight, CameraHelper, DirectionalLight, Group } from 'three';

class Sun extends Group {
    constructor(options) {
        super();

        // Merge options
        options = Object.assign({}, options);

        // Create directional light (shadow effect)
        this.direct = new DirectionalLight('#ffffff', 0.5);
        this.direct.castShadow = true;

        // Create ambient lighting (natural light)
        this.ambient = new AmbientLight('#ffffff', 0.5);

        // Update position
        this.time = 0; // 12 = noon
        this.speed = 0.25; // 1 rotation = 24 seconds
        this.updateSamples(16, false); // true = debug
        this.updatePosition({ x: 0, y: 0, z: 0 });
        this.updateTime(this.time);
        
        // Add lights to group
        this.name = 'sun';
        this.add(this.ambient, this.direct, this.direct.target);
    }

    update(delta) {
        // Update time
        this.time += delta * this.speed;
        this.updateTime(this.time);
    }

    updateSamples(size, debug) {
        this.direct.shadow.mapSize.width = Math.pow(size, 3);
        this.direct.shadow.mapSize.height = Math.pow(size, 3);
        this.direct.shadow.camera.left = -(size / 2);
        this.direct.shadow.camera.right = (size / 2);
        this.direct.shadow.camera.top = (size / 2);
        this.direct.shadow.camera.bottom = -(size / 2);
        this.direct.shadow.camera.far = size;
        this.direct.shadow.camera.near = 0;
        this.distance = size / 2;
        
        // Add debug functionality
        if (debug == true) {
            this.helper = new CameraHelper(this.direct.shadow.camera);
            this.add(this.helper);
        }
    }

    updatePosition(position = { x: 0, y: 0, z: 0 }) {
        // Only update target position for directional light. Requires new time to update position
        this.direct.target.position.copy(position);
    }

    updateTime(time = 12) {
        var hours = 24;
        var degrees = (360 * (time) / hours) % 360;
        var radians = degrees * Math.PI / 180;
        
        // Reset positions to default 45deg x-axis
        this.direct.position.set(0, 0, this.distance).applyAxisAngle({ x: -1, y: 0, z: 0 }, Math.PI / 4)

        // Rotate around y-axis (time)
        this.direct.position.applyAxisAngle({ x: 0, y: 1, z: 0 }, radians);

        // Add target position to newly rotated position
        this.direct.position.add(this.direct.target.position);
    }
}

export { Sun };