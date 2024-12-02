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
	await Embed.Load.script('../app/app.mjs?v=1733037987960', true);
	await Embed.Load.link('./styles.css?v=1733037987960');
	
	/**
	 * @type {import('../types').App}
	 */
	// @ts-ignore
	let App = window.App;
	await App.Start({
		title: 'Page',
		url: 'page',
	});
	App.Page(Page());
});

function Page() {
	/**
	 * @type {import('../types').App}
	 * @class
	 */
	// @ts-ignore
	const App = window.App;
	let B = App.B;
	return B('build').append(
	);
}
