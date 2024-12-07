// @ts-check
/**
 * @typedef {import('p5')} p5
 * @typedef {import('p5').Vector} Vector
 */
export default class Sketch {
	/**
	 * 
	 * @param {p5} P 
	 */
	constructor(P) {
		this.Processing = P;
		P.setup = this.Setup.bind(this);
    P.draw = this.Draw.bind(this);
    P.windowResized = this.WindowResized.bind(this);
    P.mousePressed = this.MousePressed.bind(this);
    P.mouseReleased = this.MouseReleased.bind(this);
		P.mouseWheel = this.MouseWheel.bind(this);
		P.mouseMoved = this.MouseMoved.bind(this);
		P.mouseClicked = this.MouseClicked.bind(this);
	}
  /**
   *
   * @param {p5} P
   */
  static Sketch(P) {
    let S = new Sketch(P);
  }
  Setup() {
		let P = this.Processing;
    let width = $(".page").width();
    let height = $(".page").height();
    if (!width || !height) return;
    this.Renderer = P.createCanvas(width, height, P.P2D);
  }
	Draw(){
		let P = this.Processing;
		P.clear();
		this.Update();
	}
	/**
	 * 
	 * @param {WheelEvent} e 
	 */
	MouseWheel(e){
	}
	WindowResized(){
		let P = this.Processing;
		let width = $(".page").width();
		let height = $(".page").height();
		if (!width || !height) return;
		P.resizeCanvas(width, height);
	}
	MousePressed(){
	}
	MouseReleased(){
	}
	MouseMoved(){
	}
	MouseClicked(){
	}
	Update() {
		
	}
}

