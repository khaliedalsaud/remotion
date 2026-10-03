import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import faces from './config/fonts.generated.json';

let ready = false;

const loadAll = (): Promise<void> => {
	if (typeof document === 'undefined') return Promise.resolve();
	return Promise.all(
		faces.map((f) => {
			const face = new FontFace(
				f.family,
				`url('${staticFile(`fonts/${f.file}`)}') format('woff2')`,
				{weight: f.weight, unicodeRange: f.unicodeRange, display: 'block'},
			);
			document.fonts.add(face);
			return face.load();
		}),
	).then(() => {
		ready = true;
	});
};

const fontsPromise = loadAll();

/**
 * Gate for anything that renders or measures text: returns true once every
 * face is loaded, holding the render (delayRender) until then.
 */
export const useFontsReady = () => {
	const [loaded, setLoaded] = useState(ready);
	const [handle] = useState(() => (ready ? null : delayRender('Loading IBM Plex fonts')));
	useEffect(() => {
		if (loaded) return;
		fontsPromise
			.then(() => {
				setLoaded(true);
				if (handle !== null) continueRender(handle);
			})
			.catch((err) => cancelRender(err));
	}, [handle, loaded]);
	return loaded;
};
