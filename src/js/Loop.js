/*
  Add functions to a recurring frequency (fps). The first loop
  interval determines the shared alpha value (0.0-to-1.0) for sibling
  intervals.

  Recommended: Add your physics engine first (ex: 30hz), then add the
  rendering engine at a higher frequency (ex: -1 = unlimited). Use the
  alpha value to interpolate rendered objects between engine steps.
*/

class Loop {
    constructor() {
        this.autoStart = true;
        this.startTime = 0;
        this.oldTime = 0;
        this.elapsedTime = 0;
        this.scale = 1;
        this.running = false;
        this.functions = [];
    }

    add(fps = 60, callback = function(){}) {
        this.functions.push({ tick: 1 / fps, sum: 0, alpha: 0, callback: callback });
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
    
            // Check if functions exist
            if (this.functions.length > 1) {
                var delta = this.getDelta();
                var alpha = this.functions[0].sum / this.functions[0].tick; // Set alpha to first interval

                // Loop through array of functions (descending order)
                for (var i = this.functions.length - 1; i >= 0; i--) {
                    var fn = this.functions[i];
                    fn.sum += delta;
        
                    // Trigger fn callback
                    if (fn.sum > fn.tick || fn.tick == -1) {
                        fn.sum %= fn.tick;
                        fn.callback({ delta: delta, alpha: alpha });
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