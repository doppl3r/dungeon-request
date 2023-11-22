// Add single or multiple synchronous loop intervals

class Loop {
    constructor() {
        this.autoStart = true;
        this.startTime = 0;
        this.oldTime = 0;
        this.elapsedTime = 0;
        this.scale = 1;
        this.running = false;
        this.intervals = [];
    }

    add(fps = 60, callback = function(){}) {
        this.intervals.push({ tick: 1 / fps, sum: 0, alpha: 0, callback: callback });
    }

    start() {
        this.startTime = this.now();
        this.oldTime = this.startTime;
        this.elapsedTime = 0;
        this.running = true;
        this.update(this);
    }

    stop() {
        this.getElapsedTime();
        this.running = false;
        this.autoStart = false;
    }

    update(loop) {
        if (this.running == true) {
            // Request visual update function before next repaint
            requestAnimationFrame(function(){ loop.update(loop); });
    
            // Loop through array of loops
            if (this.intervals.length > 1) {
                var delta = this.getDelta();
                var alpha = this.intervals[0].sum / this.intervals[0].tick; // Set alpha to first interval

                // Loop through loops (descending order)
                for (var i = this.intervals.length - 1; i >= 0; i--) {
                    var child = this.intervals[i];
                    child.sum += delta;
        
                    // Trigger loop callback
                    if (child.sum > child.tick || child.tick == -1) {
                        child.sum %= child.tick;
                        child.callback({ delta: delta, alpha: alpha });
                    }
                }
            }
        }
    }

    getElapsedTime() {
        this.getDelta();
        return this.elapsedTime;
    }

    getDelta() {
        let diff = 0;
        if (this.autoStart && !this.running) {
            this.start();
            return 0;
        }
        if (this.running) {
            const newTime = this.now();
            diff = (newTime - this.oldTime) / 1000;
            this.oldTime = newTime;
            this.elapsedTime += diff;
        }
        return diff * this.scale;
    }

    now() {
		return ( typeof performance === 'undefined' ? Date : performance ).now(); // see #10732
	}
}

export { Loop };