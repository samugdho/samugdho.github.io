// @ts-check


/**
 * @type {import('../types').EmbedFunction}
 */
// @ts-ignore
const embed = Embed;
embed('jquery', 'material-icons', 'p5js').then(async () => {
	const V = 'v=1733515924554';
	/**
	 * @type {import('../types').Embed}
	 */
	// @ts-ignore	
	let Embed = window._Embed;
	await Embed.Load.link('./styles.css?' + V);

	const Modules = {
		/** @type {import('./squig.mjs')} */
		Squig: null,
		/** @type {import('../app/app.mjs')} */
		App: null
	};
	try {
		Modules.Squig = await import('./squig.mjs?' + V);
		Modules.App = await import('../app/app.mjs?' + V);
	}catch(e){
		console.error('Failed to load modules', e);
	}
	const Squig = Modules.Squig.default;
	const App = Modules.App.default;
	await App.Start({
		title: 'Squig',
		url: 'squig',
		mode: 'p5',
		// @ts-ignore
		sketch: Squig.Sketch,
	});
});



