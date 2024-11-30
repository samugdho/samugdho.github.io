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
		Embed.Load.link(`/${App.URL}/../app/app.css`);

		$('head title').text(`${this.Title}`);

		let B = this.B;
		B('app').appendTo('body').append(
			B('', 'h1').append(
				"Hello, ",
				B('title', 'span').text(`${this.Title}`)
			),
			B('loading-spinner hide'),
		);
	}
	static B(cls = '', type = 'div') {
		return $(`<${type}>`).addClass(cls);
	}
}
// @ts-ignore
window.App = App;