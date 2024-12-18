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
	await Embed.Load.script('../app/app.mjs?v=1733531084400', true);
	await Embed.Load.link('./styles.css?v=1733531084400');
	
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
			},
			{
				name: 'Squig',
				url: '/squig',
				icon: 'gesture'
			},
			{
				name: 'Minesweeper',
				url: '/minesweeper',
				icon: 'bomb'
			},
			// {
			// 	name: 'Hidden',
			// 	url: '/hidden',
			// 	icon: 'lock'
			// }
		].map((link) => B('link', 'a').attr('href', link.url).append(
			App.Icon(link.icon), 
			B('', 'span').text(link.name)
		))
	);
}
