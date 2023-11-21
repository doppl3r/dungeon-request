import { Clock, PCFSoftShadowMap, WebGLRenderer } from 'three';
import Stats from './Stats.js';

class Loop {
    constructor() {
        this.stats = new Stats();
    }
}

export { Loop };