// @ts-check


/**
 * @type {import('../types').EmbedFunction}
 */
// @ts-ignore
const embed = Embed;
embed('jquery', 'material-icons', 'p5js').then(async () => {
	const V = 'v=1733562601970';
	/**
	 * @type {import('../types').Embed}
	 */
	// @ts-ignore	
	let Embed = window._Embed;
	await Embed.Load.link('./styles.css?' + V);

	const Modules = {
		/** @type {import('./minesweeper.mjs')} */
		Minesweeper: null,
		/** @type {import('../app/app.mjs')} */
		App: null
	};
	try {
		Modules.Minesweeper = await import('./minesweeper.mjs?' + V);
		Modules.App = await import('../app/app.mjs?' + V);
	}catch(e){
		console.error('Failed to load modules', e);
	}
	const Minesweeper = Modules.Minesweeper.default;
	const App = Modules.App.default;
	await App.Start({
		title: 'Minesweeper',
		url: 'minesweeper',
		mode: 'p5',
		// @ts-ignore
		sketch: Minesweeper.Sketch,
	});
});



