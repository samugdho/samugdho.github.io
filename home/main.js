// @ts-check
/**
 * @type {import('../types').EmbedFunction}
 */
// @ts-ignore
const embed = Embed;
embed('jquery', 'material-icons').then(async () => {
	/**
	 * @type {import('../types').Embed}
	 */
	// @ts-ignore	
	let Embed = window._Embed;
	await Embed.Load.script('../app/app.mjs', true);
	/**
	 * @type {import('../types').App}
	 */
	// @ts-ignore
	let App = window.App;
	App.Title = 'Home';
	App.URL = 'home';
	await App.Start();
});