import {createContext, useContext} from 'react';
import {Html5Audio, Sequence, staticFile} from 'remotion';
import {SFX_FILES, SFX_MASTER_VOLUME, SfxName} from '../config/assets';

export const SfxEnabled = createContext(true);

/** A one-shot sound effect at a frame local to the enclosing Sequence. */
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number}> = ({
	at,
	name,
	volume = 1,
}) => {
	const enabled = useContext(SfxEnabled);
	if (!enabled) return null;
	return (
		<Sequence from={Math.round(at)} durationInFrames={75} layout="none" name={`sfx · ${name}`}>
			<Html5Audio src={staticFile(SFX_FILES[name])} volume={volume * SFX_MASTER_VOLUME} />
		</Sequence>
	);
};
