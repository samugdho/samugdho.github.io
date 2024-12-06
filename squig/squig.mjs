// @ts-check
/**
 * @typedef {import('p5')} p5
 * @typedef {import('p5').Vector} Vector
 */
export default class Squig {
  /**
   * @type {p5}
   */
  static Processing = null;
  /**
   *
   * @param {p5} P
   */
  static Sketch(P) {
    let S = Squig;
    S.Processing = P;
    P.setup = S.Setup;
    P.draw = S.Draw;
    P.windowResized = S.WindowResized;
    P.mousePressed = S.MousePressed;
    P.mouseReleased = S.MouseReleased;
  }
  static Setup() {
		let P = Squig.Processing;
    let width = $(".page").width();
    let height = $(".page").height();
    if (!width || !height) return;
    P.createCanvas(width, height, P.P2D);
  }
	static Draw(){
		let P = Squig.Processing;
		P.clear();
		Squig.Update();
	}
	static WindowResized(){
		let P = Squig.Processing;
		let width = $(".page").width();
		let height = $(".page").height();
		if (!width || !height) return;
		P.resizeCanvas(width, height);
	}
	static MousePressed(){
		let P = Squig.Processing;
		Squig.Global.fire = true;
	}
	static MouseReleased(){
		let P = Squig.Processing;
		Squig.Global.fire = false;
		Squig.Global.fresh = true;
	}
	static Update() {
		const G = Squig.Global;
		const P = Squig.Processing;
		if(G.cooldown > 0){
			G.cooldown -= P.deltaTime
		}
		if(G.fire && G.cooldown <= 0){
			G.cooldown = G.Cooldown;
			let center = P.createVector(P.width / 2, P.height / 2);
			let mouse = P.createVector(P.mouseX, P.mouseY);
			let direction = mouse.sub(center).normalize();
			let velocity = direction.mult(G.Speed);
			if(G.fresh){
				G.fresh = false;
				G.colorIndex = (G.colorIndex + 1) % G.colors.length;
			}
			let color = G.colors[G.colorIndex];
			let squig = new Squig({
				position: center.copy(),
				velocity: velocity,
				color: color,
				life: 10000,
			});
			G.squiqs.push(squig);
		}
	
		// Update Squiqs
		for (let i = 0; i < G.squiqs.length; i++) {
			let squig = G.squiqs[i];
			if(squig.life <= 0) continue;
			squig.life -= P.deltaTime;
			squig.position.add(squig.velocity);
			squig.velocity.y += G.Gravity;
			squig.velocity.x *= 1 - G.AirResistance;
			squig.velocity.y *= 1 - G.AirResistance;
			// Bounce walls
			if(squig.position.x < 0 || squig.position.x > P.width){
				squig.velocity.x *= -1;
			}
			if(squig.position.y < 0 || squig.position.y > P.height){
				squig.velocity.y *= -1;
			}
			// Attract to self until minimum length
			let next = G.squiqs[i+1];
			if(!next) continue;
			/**
			 * @type {Vector}
			 */
			let direction = next.position.copy().sub(squig.position);
			let distance = direction.mag();
			direction.normalize();
			if(distance > G.MinimumLength){
				// squig.velocity.add(direction.mult(0.1));
			}
			// next.velocity.sub(direction.mult(-1));
		}
	
		// Remove Squiqs
		G.squiqs = G.squiqs.filter(squig => squig.life > 0);
	
		// Draw Squiqs
		let first = G.squiqs[0];
		if(!first) return;
		P.push();
		P.noFill();
		P.strokeWeight(5);
		let currentColor = first.color;
		P.stroke(currentColor);
		P.beginShape();
		P.curveVertex(first.position.x, first.position.y);
		for (let i = 1; i < G.squiqs.length; i++) {
			let squig = G.squiqs[i];
			if(squig.color != currentColor){
				currentColor = squig.color;
				P.endShape();
				P.stroke(currentColor);
				P.beginShape();
			}
			P.curveVertex(squig.position.x, squig.position.y);
		}
		P.endShape();
		P.noStroke();
		for (let i = 0; i < G.squiqs.length; i++) {
			let squig = G.squiqs[i];
			P.fill(squig.color);
			P.ellipse(squig.position.x, squig.position.y, 10, 10);
		}
		P.pop();
	}

  static Global = {
    fire: false,
    Cooldown: 50,
    Speed: 10,
    Gravity: 0.1,
    AirResistance: 0.01,
    MinimumLength: 10,
    cooldown: 0,
    /**
     * @type {Squig[]}
     */
    squiqs: [],
    colorIndex: 0,
    colors: ["#f44336", "#8bc34a", "#03a9f4", "#ffc107", "#673ab7", "#009688"],
    fresh: true,
  };
  /**
   *
   * @param {object} [options]
   * @param {Vector} [options.position]
   * @param {Vector} [options.velocity]
   * @param {string} [options.color]
   * @param {number} [options.life]
   *
   */
  constructor(options = {}) {
    let p = Squig.Processing;
    this.position = options.position || p.createVector();
    this.velocity = options.velocity || p.createVector();
    this.color = options.color || "#f44336";
    this.life = options.life || 10000;
  }
}

