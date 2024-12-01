// Find all folders
// For each file, find the file with the highest mtime
// for each file, replace '--version--' with mtime

import fs from 'fs';
import path from 'path';

const root = process.cwd();
const folders = fs.readdirSync(root).filter(f => f !== 'node_modules' && !f.startsWith('.')).filter(f => {
	const stat = fs.statSync(path.join(root, f));
	return stat.isDirectory();
});

function proccessFolder(folderPath) {
	console.log(`Updating ${folderPath}...`);
	const files = fs.readdirSync(folderPath);
	let highest_mtime = 0;
	let valid_files = [];
	let folders = [];
	for (let file of files) {
		let filePath = path.join(folderPath, file);
		let stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			folders.push(filePath);
			continue;
		}
		let mtime = stat.mtime.getTime();
		if (mtime > highest_mtime) highest_mtime = mtime;
		valid_files.push(filePath);
	}

	for (let file of valid_files) {
		let content = fs.readFileSync(file, 'utf-8');
		content = content.replace(/v=\d+/g, 'v=' + highest_mtime.toString());
		fs.writeFileSync(file, content);
		console.log(`Updated ${file}`);
	}

	for (let folder of folders) {
		proccessFolder(folder);
	}
}

for (let folder of folders) {
	let folderPath = path.join(root, folder);
	proccessFolder(folderPath);
}