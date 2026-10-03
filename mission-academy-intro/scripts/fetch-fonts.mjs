// Downloads IBM Plex Sans Arabic + IBM Plex Sans (woff2) into public/fonts and
// writes src/config/fonts.generated.json so renders never depend on the network.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const families = [
	{family: 'IBM Plex Sans Arabic', query: 'IBM+Plex+Sans+Arabic', subsets: ['arabic', 'latin']},
	{family: 'IBM Plex Sans', query: 'IBM+Plex+Sans', subsets: ['latin']},
];
const weights = [400, 500, 600, 700];
const faces = [];

for (const f of families) {
	for (const w of weights) {
		const css = await (
			await fetch(`https://fonts.googleapis.com/css2?family=${f.query}:wght@${w}&display=block`, {
				headers: {'User-Agent': UA},
			})
		).text();
		const blocks = css.split('/*').slice(1);
		for (const block of blocks) {
			const subset = block.slice(0, block.indexOf('*/')).trim();
			if (!f.subsets.includes(subset)) continue;
			const url = block.match(/url\((https:[^)]+)\)/)[1];
			const range = block.match(/unicode-range:\s*([^;]+);/)[1].trim();
			const file = `${f.family.replace(/\s+/g, '')}-${w}-${subset}.woff2`;
			const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
			fs.writeFileSync(path.join(root, 'public/fonts', file), buf);
			faces.push({family: f.family, weight: String(w), unicodeRange: range, file});
		}
	}
}

fs.writeFileSync(
	path.join(root, 'src/config/fonts.generated.json'),
	JSON.stringify(faces, null, 2) + '\n',
);
console.log(`${faces.length} font faces written`);
