// Main.js
var canvas = document.getElementById('PartCanvas');
var ctx = canvas.getContext('2d');
var particles = [];
var numNewParticlesPerUpdate = 0;
var numInitialParticles = 10;
var targetFPS = 30;
var gravity = 1.01;
var pixelSize = 4;
var $particleCount = $('#particle-count');

// Set the canvas dimensions
sizeCanvas()

// Fill the screen with black
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Save the canvas state as this is our initial starting point
ctx.save();

// Move the canvas origin to the centre of the screen
//ctx.translate(canvas.width / 2, canvas.height / 2);

function init(){
    for(i = 0; i < numInitialParticles; i++){
        particles.push(new Particle(i, canvas.width/2, canvas.height/2, gravity));
    }

    window.onresize = sizeCanvas;

    setTimeout(update, 1000 / targetFPS);
    setTimeout(render, 1000 / targetFPS);
}

function update() {
	var particlesToRemove = [];

	// Update particles
	for (var i = 0; i < particles.length; i++){
		if (particles[i].isOffScreen()) {
			particlesToRemove.push(i);

		} else {
        	particles[i].update();
		}
    }

    // Remove any off screen particles
    for (var p = 0; p < particlesToRemove.length; p++) {
    	//console.log('Particle ' + p + ' is off screen - removing');
		particles.splice(particlesToRemove[p], 1);
    }

    // Create more particles
    for(var i = 0; i < numNewParticlesPerUpdate; i++){
        particles.push(new Particle(i, canvas.width/2, canvas.height/2, gravity));
    }
    // Schedule the next update
	setTimeout(update, 1000 / targetFPS);
}

function render(){
    // Clear the screen
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    for(i=0; i<particles.length; i++){
        ctx.fillStyle= particles[i].color;
        particles[i].render(ctx);
    }

    // Update the particle count
	$particleCount.text(particles.length);

    // Schedule a redraw for the next frame
    setTimeout(render, 1000 / targetFPS);
}

function random(min, max){
    return Math.random() * (max - min) + min;
}

function sizeCanvas() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
}

function Particle(id, x, y, weight) {
	this.id = id;
    this.x = x;
    this.y = y;
    this.drag = 0.96;
    this.xVel = random(-10, 10);
    this.yVel = random(-10, 10);
    this.weight = weight;
    this.color = "hsl("+random(180, 260)+", 100%, "+random(50, 100)+"%)";
}

Particle.prototype.render = function() {
	this.render = function () {
		// Draw the particle
        ctx.fillRect(this.x, this.y, pixelSize, pixelSize);

        // Draw particle label
        ctx.fillText('[' + this.id + ']', this.x + 5, this.y - 5);
    }
}

Particle.prototype.isOffScreen = function() {
	if (this.x < 0|| this.x > canvas.width ) {
		return true;
	} else if (this.y < 0|| this.y > canvas.height) {
		return true;
	}

	return false;
}

Particle.prototype.update = function() {
	// Update position
    this.yVel *= this.drag;
    this.xVel *= this.drag;

    //this.yVel *= this.weight;
    //console.log("x:" + this.x + " Y:" + this.y + " xVel:"+this.xVel + " yVel:" + this.yVel);
    this.x += this.xVel;
    this.y += this.yVel; this.y *= this.weight;

    // Update velocity
    //this.xVel *= this.drag;
	//this.yVel *= this.drag;


}

//Initialise
init();