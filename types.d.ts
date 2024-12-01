export type EmbedKey = 'jquery' | 'lz-string' | 'p5js' | 'material-icons' | 'livejs' | 'crypto-js' | 'jspdf';
export type EmbedFunction = (...options: EmbedKey[]) => Promise<void>;
export type Embed = {
	Load: {
		link: (url: string) => Promise<void>;
		script: (url: string, module?: boolean) => Promise<void>;
	},
}
export type AppStartOptions = {
	title?: string;
	url?: string;
}
export type App = {
	Start: (options?: AppStartOptions) => Promise<void>;
	Title: string;
	URL: string;
	Page: (build: JQuery<HTMLElement>) => void;
	B: (cls?: string, tag?: string = 'div') => JQuery<HTMLElement>;
	Icon: (name: string) => JQuery<HTMLElement>;
}