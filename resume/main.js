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
	await Embed.Load.script('../app/app.mjs?v=1733037145277', true);
	await Embed.Load.link('./styles.css?v=1733037145277');
	/**
	 * @type {import('../types').App}
	 */
	// @ts-ignore
	let App = window.App;
	await App.Start({
		title: 'Resume',
		url: 'resume',
	});
	App.Page(Resume());
});

function Resume() {
	/**
	 * @type {import('../types').App}
	 * @class
	 */
	// @ts-ignore
	const App = window.App;
	let B = App.B;
	return B('resume').append(
		B('title', 'h1').html('Sadman Mugdho'),
		B('', 'h2').html('Objective'),
		B('', 'p').html('Motivated computer science graduate seeks entry-level role in software development. Brings strong academic background, coding and problem-solving skills, and hands-on experiences to contribute to a dynamic software development team.'),

		B('', 'h2').html('Education'),
		B('', 'p').html(' Bachelor of Science in Computing Science, Thompson Rivers University, BC, Canada, 2024'),

		B('', 'h2').html('Relevant Coursework'),
		B('', 'p').html('Data Structures, Algorithms, Software Engineering, Database Management Systems, Operating Systems, Web Development, Computer Networks, and Machine Learning'),

		B('', 'h2').html('Skills'),
		B('', 'ul').append(
			...[
				'Programming languages: <code>Java</code>, <code>Python</code>, and <code>C++</code>',
				'Web development technologies: <code>HTML</code>, <code>CSS</code>, <code>JavaScript</code>, <code>Node.js</code>, <code>Angular</code>, <code>jQuery</code>, <code>ExpressJS</code>.',
				'Database management system: <code>SQL</code>, <code>MongoDB</code>, <code>Firebase</code>.',
				'Software design principles <code>SOLID</code>, design patterns, unit tests, version control <code>Git</code>.',
				'Operating system: <code>Linux</code>, <code>Windows</code>, and <code>Mac</code>.',
				'Visual arts and interactive media: <code>Processing</code>, and <code>GLSL</code>.',
				'Able to analyze and solve critical problems.',
				'Able to collaborate in a team, work under pressure and meet stringent deadlines.',
				'Able to communicate well both verbally and written.',
			].map(s => B('', 'li').html(s))
		),

		B('', 'h2').html('Projects'),
		B('projects').append(
			...[{
				title: 'AI Chatbot',
				link: 'https://github.com/samugdho/spacybot',
				languages: 'Node, Node-NLP, HTML, CSS, JavaScript',
				features: 'A visually captivating UI. Contextual AI chatbot offers personalized insights on astronomical objects.',
			}, {
				title: 'Physics Simulation',
				link: 'https://git.io/vbmbm',
				languages: 'Python, PyGame',
				features: 'Implementation of Verlet physics in python and visualized in pygame. It can be used to show interactions between rigid objects and particles in 2D space with gravity.',
			}, {
				title: 'Multiplayer 3D Game',
				link: 'https://git.io/vNMVh',
				languages: 'Nodejs, SocketIO, THREEjs, HTML, CSS, JavaScript',
				features: 'A proof of concept of making a spherical world that can be fully traversed. Uses Heroku server and Socket.IO for client-server communication. Uses THREEjs for the graphics and features multiple players and a functional chat system.',


			}].map(p => B('project').append(
				B('title', 'h3').html(p.title),
				B('link', 'a').attr('href', p.link).html(p.link),
				B('languages', 'h3').html(p.languages.split(',').map(s => `<code>${s}</code>`).join('')),
				B('features', 'p').html(p.features),
			)),
		),

		B('', 'h2').html('Experience'),
		B('jobs').append(
			...[{
				title: 'Mobile App Development, Ref Buddy',
				link: 'https://refbuddy.ca/',
				dates: 'Sept, 2023 - Dec, 2023',
				languages: 'Flutter, Firebase, Android Studio',
				features: [
					'Contributed in coding, testing, and debugging. Collaborated closely with team members and actively participated in code reviews.',
					'Collaborated closely with team members and actively participated in code reviews.',
				],
			},].map(p => B('job').append(
				B('title', 'h3').html(p.title),
				B('link', 'a').attr('href', p.link).html(p.link),
				B('dates', 'p').html(p.dates),
				B('languages', 'p').html(p.languages),
				B('features', 'ul').append(
					...p.features.map(s => B('', 'li').html(s))
				),
			))

		),
		B('', 'h2').html('Activities and Volunteering'),
		B('', 'ul').append(
			...[
				'Participated in the First Robotics competition in high school (2012); Created a remote-controlled dog-sized discus throwing robot in a team. Demo: <a href="https://youtu.be/4Xecmfwx7Bw">https://youtu.be/4Xecmfwx7Bw</a>',
				'Participated in the 2D animation division at the Fall 2013 Skills Alberta contest to showcase hands-on trade abilities; Won 4th place.',
				'Tutored agroup junior Comp. Sci. student for a hackathon competition in 2018.',
				'Volunteered at election booths in directing traffic in 2022.',
				'Worked as a Safety Specialist Ambassador, guiding children to safe areas at a trampoline gym in 2021.',
				'Worked as a day banker at a high-end casino in 2019.',
			].map(s => B('', 'li').html(s))
		),
		B('', 'h2').html('References'),
	);
}