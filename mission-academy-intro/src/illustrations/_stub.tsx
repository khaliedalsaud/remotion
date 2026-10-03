import {Frame, Halftone, PAL, useIds} from './kit';

/** Temporary neutral artwork for a slot whose illustration is not drawn yet. */
export const Stub: React.FC = () => {
	const ids = useIds('dots');
	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
			</defs>
			<circle cx={600} cy={600} r={380} fill={`url(#${ids.dots})`} />
		</Frame>
	);
};
