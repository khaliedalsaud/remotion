// The closing tagline «من المعرفة… إلى الممارسة.», shared by Scene 6 (where it
// is built) and Scene 7 (where it leaves). Laid out like Scene 1's question —
// right-aligned display lines — so it reads as that question's answer.
import {Words} from '../components/Words';
import {COLORS, WEIGHT} from '../config/brand';
import {CANVAS, HANDOFF, SAFE} from '../config/layout';
import {TEXT} from '../config/script';
import type {Rect} from '../motion';
import {textWidth} from '../measure';

const T = TEXT.s6;
const SIZE = 152;
const WEIGHT_TAG = WEIGHT.display;
/** Underline offset below a line box's top, as a fraction of font size (as Scene 1). */
const UNDER = 1.2;
const LINE_H = 1.25;

export const TAG = {
	right: SAFE.right as number,
	size: SIZE,
	/** Line 1's underline sits exactly on Scene 5's last dot. */
	topA: HANDOFF.s5s6Dot.y - SIZE * UNDER,
	topB: HANDOFF.s5s6Dot.y - SIZE * UNDER + SIZE * LINE_H,
	underA: HANDOFF.s5s6Dot.y as number,
	underB: HANDOFF.s5s6Dot.y + SIZE * LINE_H,
};

/**
 * Scene 6's window, opened out: it keeps the right edge of the opening's window
 * (where the thread is tied) and bleeds off the left, top and bottom edges.
 */
export const OPEN_RECT: Rect = {x: -40, y: -40, w: 900, h: 1160};

/** Horizontal extent of the two key words (screen px). */
export const taglineSpans = () => {
	const wA = textWidth(`${T.from} ${T.knowledge}`, SIZE, WEIGHT_TAG);
	const wK = textWidth(T.knowledge, SIZE, WEIGHT_TAG);
	const wB = textWidth(`${T.to} ${T.practice}`, SIZE, WEIGHT_TAG);
	const wP = textWidth(T.practice, SIZE, WEIGHT_TAG);
	return {
		knowledge: {left: TAG.right - wA, right: TAG.right - wA + wK},
		practice: {left: TAG.right - wB, right: TAG.right - wB + wP},
	};
};

const Line: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
	<div
		style={{
			position: 'absolute',
			right: CANVAS.width - TAG.right,
			top,
			fontSize: SIZE,
			fontWeight: WEIGHT_TAG,
			lineHeight: LINE_H,
			whiteSpace: 'nowrap',
			color: COLORS.ink,
		}}
	>
		{children}
	</div>
);

export const Tagline: React.FC<{
	start: number;
	exitAt?: number;
	exitDuration?: number;
	practiceColor: string;
}> = ({start, exitAt, exitDuration = 12, practiceColor}) => (
	<>
		<Line top={TAG.topA}>
			<Words text={`${T.from} ${T.knowledge}`} start={start} stagger={6} duration={22} exitAt={exitAt} exitDuration={exitDuration} />
		</Line>
		<Line top={TAG.topB}>
			<Words
				text={`${T.to} ${T.practice}`}
				start={start + 10}
				stagger={6}
				duration={22}
				exitAt={exitAt}
				exitDuration={exitDuration}
				renderWord={(w) => (w === T.practice ? <span style={{color: practiceColor}}>{w}</span> : w)}
			/>
		</Line>
	</>
);
