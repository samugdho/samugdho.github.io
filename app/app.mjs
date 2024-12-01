// @ts-check
class App {
	static Title = 'App';
	static URL = 'app';
	/**
	 * 
	 * @param {import('../types').AppStartOptions} [options] 
	 */
	static async Start(options = {}) {
		console.log("Start");
		if (options.title) this.Title = options.title;
		if (options.url) this.URL = options.url;
		/**
		 * @type {import('../types').Embed}
		 */
		// @ts-ignore	
		let Embed = _Embed;
		await Embed.Load.link(`/${App.URL}/../app/app.css?v=1733037145269`);

		$('head title').text(`${this.Title}`);

		this.SetupSettings();

		let B = this.B;
		B('app').appendTo('body').append(
			B('', 'h1').append(
				B('home-page', 'a').attr('href', '/').text('Hello, '),
				B('title', 'span').text(`${this.Title}`)
			),
			B('loading-spinner hide'),
			B('page'),
			
		);
		this.Grid();
		$(window).on('resize', () => {
			this.Grid();
		});
		setTimeout(() => {
			$('.app-cover').removeClass('show');
		}, 100);
	}
	/**
	 * 
	 * @param {JQuery<HTMLElement>} build 
	 */
	static Page(build){
		$('.page').empty().append(build);
	}
	static B(cls = '', type = 'div') {
		return $(`<${type}>`).addClass(cls);
	}
	/**
	 * 
	 * @param {string} name 
	 * @returns 
	 */
	static Icon(name) {
		return App.B(`icon ${name} material-symbols-sharp`).html(name);
	}
	static SetupSettings() {
		let B = this.B;
		let Icon = this.Icon;
		const SettingsKey = 'tts-reader-settings';
		/**
		 * @type {string | null}
		 */
		let settingsJSON = localStorage.getItem(SettingsKey);
		const DefaultSettings = {
			theme: 'dark',
		};
		
		/** @type {typeof DefaultSettings} */
		let settings = settingsJSON ? JSON.parse(settingsJSON) : DefaultSettings;
		function saveSettings() {
			localStorage.setItem(SettingsKey, JSON.stringify(settings));
		}
		let mode = settings.theme;
		$('body').attr('theme', mode);
		/**
		 * On click switch theme
		 * @param {JQuery.ClickEvent} e 
		 */
		function switchTheme(e){
			let btn = $(e.target).closest('.theme-switch');
			let mode = btn.attr('mode');
			// Switch mode
			mode = mode == 'dark' ? 'light' : 'dark';
			btn.attr('mode', mode);
			btn.text(mode == 'dark' ? 'Dark Mode' : 'Light Mode');
			$('body').attr('theme', mode);
			// Save
			settings.theme = mode;
			saveSettings();
		}
		// @ts-ignore
		window._app = {
			switch_theme: switchTheme,
		}
		saveSettings();

		B('settings').appendTo('body').append(
			Icon('settings').on('click', e => {
				// @ts-ignore
				let settings = JSON.parse(localStorage.getItem(SettingsKey)); 
				let mode = settings.theme;
				// Must not have anonymous function events
				// Will be converted to HTML text
				let page = B('settings-page').append(
					B('theme-switch', 'button').attr('mode', mode)
						.text(mode == 'dark' ? 'Dark Mode' : 'Light Mode')
						.attr('onclick', '_app.switch_theme(event)'),
				);
				App.Popup(page.html(), 'modal');
			})
		);
	}
	static GridGap = 72;
	/**
	 * 
	 * @param {DeviceOrientationEvent | PointerEvent} e 
	 */
	static UpdateGrid(e){
		let shift = {x: 0, y: 0};
		if(e instanceof DeviceOrientationEvent){
			if(!e.alpha || !e.beta || !e.gamma) return;
			shift.x = (e.gamma || 0) / 90;
			shift.y = (e.beta || 0) / 180;
		}else if(e instanceof PointerEvent){
			if(App.IsMobile()) return;
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
		let cross = {
			width: gap / 10,
			height: gap / 10,
			/** @type {Array<{x1: number, y1: number, x2: number, y2: number}>} */
			lines: [],
			/** @type {Array<{x: number, y: number}>} */
			points: [],
		}
		cross.lines.push(
			{x1: cross.width / 2, y1: 0, x2: cross.width / 2, y2: cross.height},
			{x1: 0, y1: cross.height / 2, x2: cross.width, y2: cross.height / 2},
		)
		for(let i = -gap / 2; i < width + gap; i += gap){
			for(let j = -gap / 2; j < height + gap; j += gap){
				cross.points.push({x: i - cross.width / 2, y: j - cross.height / 2});
			}
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
			NS('crosshair', 'symbol').attr({
				viewBox: `0 0 ${cross.width} ${cross.height}`,
				id: 'crosshair',
				width: cross.width,
				height: cross.height,
			}).append(
				...cross.lines.map(line => NS('', 'line').attr(line)),
			),
			NS('grid-lines', 'g').append(
				...lines.map(line => NS('', 'line').attr(line)),
				...cross.points.map(point => NS('', 'use').attr({
					href: '#crosshair',
					x: point.x,
					y: point.y
				}))
			)
		).appendTo('body');

		// Add css
		if($('.grid-css').length != 0) return;
		B('grid-css', 'style').text(`
			svg.grid{
				position: fixed;
				z-index: -1;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				.grid-lines line{
					stroke: #37474F; 
					stroke-width: 0.5;
				}
				.crosshair line{
					stroke: #607D8B; 
					stroke-width: 1;
				}
			}
		`).appendTo('head');

	}
	static IsMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}
	/**
	 * @typedef {'error' | 'regular' | 'modal'} PopupType
	 * @type {{message: string, type: PopupType}[]}
	 */
	static PopupStack = [];
	/**
	 * Supports HTML
	 * type = 'modal' gets rid of padding
	 * @param {string} message 
	 * @param {PopupType} type
	 * @returns 
	 */
	static Popup(message, type = 'regular') {
		let exists = $('.popup').length > 0;
		if (exists) {
			App.PopupStack.push({ message, type });
			return;
		}
		if (type === 'error') {
			console.error(message);
		} else {
			console.log(message);
		}
		let B = App.B;
		$('.popup').remove();
		let error_cls = type === 'error' ? ' error' : '';
		return B('popup' + error_cls).attr('type', type).on('click', (e) => {
			e.stopPropagation(),
				// Remove on click
				$(e.target).closest('.popup').remove();
			// Show from stack
			let popup = App.PopupStack.shift();
			if (!popup) return;
			App.Popup(popup.message, popup.type);
		}).prependTo('body').append(
			B('message', 'pre').html(`${message}`).on('click', (e) => {
				e.stopPropagation();
			})
		);
	}
}
// @ts-ignore
window.App = App;