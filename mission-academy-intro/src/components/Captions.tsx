import {useCurrentFrame} from 'remotion';
import {COLORS, FONT_AR, WEIGHT} from '../config/brand';
import {CAPTION_ZONE, CANVAS} from '../config/layout';
import {VOICEOVER} from '../config/script';
import {EASE, prog} from '../motion';

const CHUNKS = VOICEOVER.flatMap((l) => l.chunks);

/** Burned-in Arabic captions in a fixed band below the content area. */
export const Captions: React.FC = () => {
	const frame = useCurrentFrame();
	const index = CHUNKS.findIndex((c) => frame >= c.from && frame < c.to);
	if (index === -1) return null;
	const c = CHUNKS[index];
	const prev = CHUNKS[index - 1];
	const next = CHUNKS[index + 1];
	// Back-to-back chunks swap text in place; only fade at the edges of a run.
	const fadeIn = prev && prev.to >= c.from ? 1 : prog(frame, c.from, 5, EASE.out);
	const fadeOut = next && next.from <= c.to ? 1 : 1 - prog(frame, c.to - 5, 5, EASE.in);
	return (
		<div
			style={{
				position: 'absolute',
				left: CANVAS.cx,
				top: CAPTION_ZONE.centerY,
				transform: 'translate(-50%, -50%)',
				maxWidth: CAPTION_ZONE.maxWidth,
				width: 'max-content',
				opacity: Math.min(fadeIn, fadeOut),
				background: 'rgba(24, 43, 69, 0.88)',
				color: COLORS.white,
				fontFamily: FONT_AR,
				fontWeight: WEIGHT.caption,
				fontSize: CAPTION_ZONE.fontSize,
				lineHeight: 1.45,
				padding: '6px 28px 10px',
				borderRadius: 10,
				textAlign: 'center',
				direction: 'rtl',
			}}
		>
			{c.text}
		</div>
	);
};
