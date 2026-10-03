import {continueRender, delayRender, staticFile} from 'remotion';

export const fontAr = 'IBM Plex Sans Arabic';
export const fontEn = 'Montserrat';

// Fonts are bundled in public/fonts so renders work offline.
const FONTS: [string, string, string][] = [
	[fontAr, '300', 'IBMPlexSansArabic-300.woff2'],
	[fontAr, '500', 'IBMPlexSansArabic-500.woff2'],
	[fontAr, '700', 'IBMPlexSansArabic-700.woff2'],
	[fontEn, '600', 'Montserrat-600.woff2'],
	[fontEn, '800', 'Montserrat-800.woff2'],
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading fonts');
	Promise.all(
		FONTS.map(([family, weight, file]) => {
			const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {
				weight,
			});
			document.fonts.add(face);
			return face.load();
		}),
	)
		.then(() => continueRender(handle))
		.catch((err) => {
			console.error(err);
			continueRender(handle);
		});
}
