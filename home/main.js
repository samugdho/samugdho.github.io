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
	await Embed.Load.script('../app/app.mjs?v=1733037145274', true);
	await Embed.Load.link('./styles.css?v=1733037145274');
	
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
		B('title', 'h1').text('Links'),
		...[
			{
				name: 'Resume',
				url: '/resume',
				icon: 'article'
			}
		].map((link) => B('link', 'a').attr('href', link.url).append(
			App.Icon(link.icon), 
			B('', 'span').text(link.name)
		))
	);
}
