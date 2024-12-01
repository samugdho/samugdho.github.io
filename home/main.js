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
	await Embed.Load.link('./styles.css');
	/**
	 * @type {import('../types').App}
	 */
	// @ts-ignore
	let App = window.App;
	await App.Start({
		title: 'Home',
		url: 'home',
	});
	App.Page(Home());
});

function Home() {
	/**
	 * @type {import('../types').App}
	 * @class
	 */
	// @ts-ignore
	const App = window.App;
	let B = App.B;
	return B('home-links').append(
		...[
			{
				name: 'Resume',
				url: '/resume',
			}
		].map((link) => B('link', 'a').attr('href', link.url).text(link.name))
	)
}
