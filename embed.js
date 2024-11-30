// @ts-check
/**
	 * Embed external resources and wait for them to load.
	 * @typedef {'jquery' | 'lz-string' | 'p5js' | 'material-icons' | 'livejs' | 'crypto-js'} EmbedKey
	 * @param {...EmbedKey} options
	 * @returns {Promise<void>} Resolves when all resources are loaded.
	 */
const Embed = async function (...options) {
	/**
	 * @type {Record<string, {name: string, type: 'script' | 'link' | 'module', url: string, import?: string}>}
	 */
	const Link = {
		'material-icons': {
			name: 'Material Sybbols Sharp',
			type: 'link',
			url: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,400,1,0'
		},
		jquery: {
			name: 'jQuery 3.7.1 slim',
			type: 'script',
			url: 'https://code.jquery.com/jquery-3.7.1.min.js'
		},
		'lz-string': {
			name: 'LZString 1.5.0',
			type: 'script',
			url: 'https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js'
		},
		p5js: {
			name: 'p5.js 1.4.1',
			type: 'script',
			url: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js'
		},
		livejs: {
			name: 'Live.js',
			type: 'script',
			url: 'https://livejs.com/live.js'
		},
		'crypto-js': {
			name: 'Crypto.js',
			type: 'script',
			url: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js'
		},
		three: {
			name: 'Three.js',
			type: 'module',
			import: 'three',
			url: 'https://unpkg.com/three/build/three.module.js'
		},
		'three-addons': {
			name: 'Three.js addons',
			type: 'module',
			import: 'three/addons/',
			url: 'https://unpkg.com/three/examples/jsm/'
		},
	};
	const Load = {
		/**
		 * 
		 * @param {string} src 
		 * @returns {Promise<void>}
		 */
		script(src, module = false) {
			return new Promise((resolve, reject) => {
				let script = document.createElement("script");
				script.src = src;
				script.async = false;
				if (module) script.type = 'module';
				document.head.appendChild(script);
				script.onload = () => resolve();
				script.onerror = () => reject(new Error(`Failed to load: ${src}`));
			});
		},
		/**
		 * 
		 * @param {string} url 
		 * @returns {Promise<void>}
		 */
		link(url) {
			return new Promise((resolve, reject) => {
				let link = document.createElement("link");
				link.rel = "stylesheet";
				link.href = url;
				document.head.appendChild(link);
				link.onload = () => resolve();
				link.onerror = () => reject(new Error(`Failed to load: ${url}`));
				function fallback() {
					for (let styles of document.styleSheets) {
						if (styles.href === url) {
							resolve();
							return;
						}
					}
					setTimeout(fallback, 50);
				}
				fallback();
			});
		},
		AllImportMaps() {
			// Check if exists
			if (document.querySelector('.app-importmap')) {
				console.warn('Importmap already exists');
				return;
			}
			const Imports = Object.keys(Link).filter(option => Link[option].type == 'module');
			let map = {
				imports: {}
			}
			for (let option of Imports) {
				let link = Link[option];
				let url = link.url;
				let imp = link.import;
				map.imports[imp] = url;
			}

			let script = document.createElement('script');
			script.type = 'importmap';
			script.id = 'importmap';
			script.classList.add('app-importmap');
			script.text = JSON.stringify(map);
			document.head.appendChild(script);
		}
	}
	// @ts-ignore
	window._Embed = {
		Load,
	}

	console.log("Embed...");
	Load.AllImportMaps();
	let Resources = new Set();
	let promises = options.map(option => {
		let link = Link[option];
		let type = link.type;
		let url = link.url;
		let name = link.name;

		// Check if the resource has already been loaded
		if (Resources.has(url)) {
			console.warn(`${name} already loaded`);
			// Skip this resource
			return Promise.resolve();
		}

		// Mark the resource as loaded
		Resources.add(url);

		if (type === 'script') {
			return Load.script(url)
		} else if (type === 'link') {
			return Load.link(url)
		}
	});
	// Wait for all resources to load
	await Promise.all(promises);
}