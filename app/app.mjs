// @ts-check
class App {
	static Title = 'App';
	static URL = 'app';
	static async Start() {
		console.log("Start");
		/**
		 * @type {import('../types').Embed}
		 */
		// @ts-ignore	
		let Embed = _Embed;
		await Embed.Load.link(`/${App.URL}/../app/app.css`);

		$('head title').text(`${this.Title}`);

		let B = this.B;
		B('app').appendTo('body').append(
			B('', 'h1').append(
				"Hello, ",
				B('title', 'span').text(`${this.Title}`)
			),
			B('loading-spinner hide'),
			
		);
		this.Grid();
		$(window).on('resize', () => {
			this.Grid();
		});
		setTimeout(() => {
			$('.app-cover').removeClass('show');
		}, 100);
	}
	static B(cls = '', type = 'div') {
		return $(`<${type}>`).addClass(cls);
	}
	static GridGap = 48;
	/**
	 * 
	 * @param {DeviceOrientationEvent | PointerEvent} e 
	 */
	static UpdateGrid(e){
		let shift = {x: 0, y: 0};
		if(e instanceof DeviceOrientationEvent){
			if(!e.alpha || !e.beta || !e.gamma) return;
			shift.x = (e.gamma || 0) / 90;
			shift.y = (e.beta || 0) / 90;
		}else if(e instanceof PointerEvent){
			let width = $(window).width();
			let height = $(window).height();
			if(!width || !height) return;
			shift.x = (e.clientX - width / 2) / width * 2;
			shift.y = (e.clientY - height / 2) / height * 2;
		}
		// console.log('shift', shift);
		let lines = $('svg.grid .grid-lines');
		let gap = -App.GridGap / 2;
		lines.css({
			translate: `${shift.x * gap}px ${shift.y * gap}px`
		})
	}
	static Grid(){
		// Remove old grid
		let grid = $('.grid');
		let update = this.UpdateGrid;
		if(grid.length){
			console.log('Remove grid');
			grid.remove();
			window.removeEventListener('deviceorientation', update);
			window.removeEventListener('pointermove', update);
		}
		

		// Make an svg grid
		let B = this.B;
		let width = $(window).width();
		let height = $(window).height();
		if(!width || !height) return;
		let gap = this.GridGap;
		let lines = [];
		for (let i = -gap / 2; i < width + gap; i += gap) {
			lines.push({x1: i, y1: -gap / 2, x2: i, y2: height + gap});
		}
		for (let i = -gap / 2; i < height + gap; i += gap) {
			lines.push({x1: -gap / 2, y1: i, x2: width + gap, y2: i});
		}
		/**
		 * 
		 * @param {string} type 
		 * @returns 
		 */
		function NS(cls='', type){
			return $(document.createElementNS('http://www.w3.org/2000/svg', type)).addClass(cls);
		}
		
		
		window.addEventListener('deviceorientation', update);
		window.addEventListener('pointermove', update);

		NS('grid', 'svg').attr({
			width: width,
			height: height,
			viewBox: `0 0 ${width} ${height}`,
			// 'data-interval': interval
		}).css({
			position: 'fixed',
			zIndex: -1,
			top: 0,
			left: 0,
		}).append(
			NS('grid-lines', 'g').append(
				...lines.map(line => NS('', 'line').attr(line)),
			)
		).appendTo('body');

		// Add css
		if($('.grid-css').length != 0) return;
		B('grid-css', 'style').text(`
			.grid{
				position: fixed;
				z-index: -1;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				.grid-lines line{
					stroke: #555; 
					stroke-width: 0.5;
				}
			}
		`).appendTo('head');

	}
}
// @ts-ignore
window.App = App;