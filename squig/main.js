// @ts-check


/**
 * @typedef {import('p5')} p5
 */


/**
 * @type {import('../types').EmbedFunction}
 */
// @ts-ignore
const embed = Embed;
embed('jquery', 'material-icons', 'p5js').then(async () => {
	/**
	 * @type {import('../types').Embed}
	 */
	// @ts-ignore	
	let Embed = window._Embed;
	await Embed.Load.script('../app/app.mjs?v=1733103592273', true);
	await Embed.Load.link('./styles.css?v=1733103592273');
	
	/**
	 * @type {import('../types').App}
	 */
	// @ts-ignore
	let App = window.App;
	await App.Start({
		title: 'Squig',
		url: 'squig',
	});
	App.Page(Home());
});

/** @type {p5} */
let p;
function Home() {
	/**
	 * @type {import('../types').App}
	 * @class
	 */
	// @ts-ignore
	const App = window.App;
	let B = App.B;
	// @ts-ignore
	p = new p5(sketch);
	return B('squig').append(
		B('squiq-canvas', 'canvas')
	);
}
/**
 * 
 * @param {p5} p 
 */
function sketch(p){
	p.setup = _setup;
	p.draw = _draw;
	p.windowResized = _windowResized;
	p.mousePressed = _mousePressed;
	p.mouseReleased = _mouseReleased;
}
const Squig = {
	fire: false,
	Cooldown: 50,
	Speed: 5,
	Gravity: 0.1,
	AirResistance: 0.001,
	cooldown: 0,
	squiqs: [],
	colorIndex: 0,
	colors: [
		'#f44336',
		'#8bc34a',
		'#03a9f4',
		'#ffc107',
		'#673ab7',
		'#009688',
	],
	fresh: true,
};
function _setup(){
	// Setup p5
	let width = $('.page').width();
	let height = $('.page').height();
	if(!width || !height) return;
	let canvas = p.createCanvas(width, height, p.P2D);
	$('.squiq-canvas').replaceWith($(canvas.elt).addClass('squiq-canvas'));
}
function _draw(){
	p.clear();
	update();
}
function _windowResized(){
	let width = $('.page').width();
	let height = $('.page').height();
	if(!width || !height) return;
	p.resizeCanvas(width, height);
}
function _mousePressed(){
	Squig.fire = true;
}
function _mouseReleased(){
	Squig.fire = false;
	Squig.fresh = true;
}
function update(){
	if(Squig.cooldown > 0){
		Squig.cooldown -= p.deltaTime
	}
	if(Squig.fire && Squig.cooldown <= 0){
		Squig.cooldown = Squig.Cooldown;
		let center = p.createVector(p.width / 2, p.height / 2);
		let mouse = p.createVector(p.mouseX, p.mouseY);
		let direction = mouse.sub(center).normalize();
		let velocity = direction.mult(Squig.Speed);
		if(Squig.fresh){
			Squig.fresh = false;
			Squig.colorIndex = (Squig.colorIndex + 1) % Squig.colors.length;
		}
		let color = Squig.colors[Squig.colorIndex];
		let squig = {
			position: center.copy(),
			velocity: velocity,
			color: color,
			life: 10000,
		}
		Squig.squiqs.push(squig);
	}

	// Update Squiqs
	for (let squig of Squig.squiqs) {
		if(squig.life <= 0) continue;
		squig.life -= p.deltaTime;
		squig.position.add(squig.velocity);
		squig.velocity.y += Squig.Gravity;
		squig.velocity.x *= 1 - Squig.AirResistance;
		squig.velocity.y *= 1 - Squig.AirResistance;
	}

	// Remove Squiqs
	Squig.squiqs = Squig.squiqs.filter(squig => squig.life > 0);

	// Draw Squiqs
	let first = Squig.squiqs[0];
	if(!first) return;
	p.push();
	p.noFill();
	p.strokeWeight(5);
	let currentColor = first.color;
	p.stroke(currentColor);
	p.beginShape();
	p.curveVertex(first.position.x, first.position.y);
	for (let i = 1; i < Squig.squiqs.length; i++) {
		let squig = Squig.squiqs[i];
		if(squig.color != currentColor){
			currentColor = squig.color;
			p.endShape();
			p.stroke(currentColor);
			p.beginShape();
		}
		p.curveVertex(squig.position.x, squig.position.y);
	}
	p.endShape();
	p.pop();
	
}

