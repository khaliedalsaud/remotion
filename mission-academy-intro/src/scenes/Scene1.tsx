// Scene 1 (0–5s) — «كيف تتحول المعرفة إلى ممارسة؟»
// The thread is born as an underline beneath «المعرفة», travels to «ممارسة؟»,
// then leaves the sentence and unfolds into a window onto a training session.
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {Clip} from '../components/Clip';
import {Sfx} from '../components/Sfx';
import {Words} from '../components/Words';
import {COLORS, THREAD, WEIGHT} from '../config/brand';
import {CANVAS, HANDOFF, SAFE} from '../config/layout';
import {cue, TEXT} from '../config/script';
import {EASE, mix, mixRect, prog, Rect} from '../motion';
import {textWidth} from '../measure';

const T = TEXT.s1;
const RIGHT: number = SAFE.right;
const L1 = {size: 92, weight: WEIGHT.title, top: 196};
const L2 = {size: 176, weight: WEIGHT.display, top: 286};
const L3 = {size: 176, weight: WEIGHT.display, top: 506};
/** Underline offset below a line box's top, as a fraction of font size. */
const UNDER = 1.3;
const WIN = HANDOFF.s1s2Window;

const EXIT_AT = 138;

const Line: React.FC<{top: number; size: number; weight: number; children: React.ReactNode}> = ({
	top,
	size,
	weight,
	children,
}) => (
	<div
		style={{
			position: 'absolute',
			right: CANVAS.width - RIGHT,
			top,
			fontSize: size,
			fontWeight: weight,
			lineHeight: 1.25,
			whiteSpace: 'nowrap',
			color: COLORS.ink,
		}}
	>
		{children}
	</div>
);

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const kCue = cue('s1', 'knowledge');
	const pCue = cue('s1', 'practice');

	const wKnow = textWidth(T.knowledge, L2.size, L2.weight);
	const wLine3 = textWidth(`${T.to} ${T.practice}`, L3.size, L3.weight);
	const wPractice = textWidth(T.practice, L3.size, L3.weight);
	const u2 = L2.top + L2.size * UNDER;
	const u3 = L3.top + L3.size * UNDER;
	const th = THREAD.width;

	// 1. Underline draws beneath «المعرفة» (right → left) as the word is spoken.
	const draw = prog(frame, kCue - 16, 18, EASE.out);
	// 2. Inchworm travel to «ممارسة؟»: the leading (left) edge moves first.
	const travelL = prog(frame, kCue + 6, 18, EASE.inOut);
	const travelR = prog(frame, kCue + 12, 18, EASE.inOut);
	const travelY = prog(frame, kCue + 8, 18, EASE.inOut);
	// 3. Leaves the sentence, heads for the window position, unfolds into it.
	const outL = prog(frame, pCue + 2, 14, EASE.inOut);
	const outR = prog(frame, pCue + 6, 14, EASE.inOut);
	const unfold = prog(frame, pCue + 10, 18, EASE.inOut);

	const knowLeft = RIGHT - wKnow;
	const pracLeft = RIGHT - wLine3;
	const pracRight = pracLeft + wPractice;

	let left = mix(RIGHT, knowLeft, draw);
	let right = RIGHT;
	left = mix(left, pracLeft, travelL);
	right = mix(right, pracRight, travelR);
	left = mix(left, WIN.x, outL);
	right = mix(right, WIN.x + WIN.w, outR);
	const y = mix(u2, u3, travelY);
	const dash: Rect = {x: left, y: y - th / 2, w: Math.max(0, right - left), h: th};
	const rect = mixRect(dash, WIN, unfold);

	const reveal = prog(frame, pCue + 13, 12, EASE.out);
	const zoom = mix(1.22, 1, prog(frame, pCue + 10, 32, EASE.out));
	const practiceColor = interpolateColors(
		prog(frame, pCue - 6, 10, EASE.out),
		[0, 1],
		[COLORS.ink, COLORS.primary],
	);
	const drift = mix(1, 1.012, prog(frame, 0, 150, EASE.soft));

	return (
		<AbsoluteFill>
			{draw > 0 ? (
				<Clip
					rect={rect}
					slot="training"
					border={mix(0, 8, reveal)}
					shadow={reveal}
					radius={mix(th / 2, 3, unfold)}
					fill={COLORS.primary}
					contentOpacity={reveal}
					zoom={{scale: zoom, x: 0.55, y: 0.45}}
				/>
			) : null}
			<AbsoluteFill
				style={{
					transform: `scale(${drift})`,
					transformOrigin: `${RIGHT}px 50%`,
					opacity: 1 - prog(frame, EXIT_AT, 10, EASE.in),
				}}
			>
				<Line {...L1}>
					<Words text={T.line1} start={0} stagger={5} duration={20} />
				</Line>
				<Line {...L2}>
					<Words text={T.knowledge} start={8} duration={22} />
				</Line>
				<Line {...L3}>
					<Words
						text={`${T.to} ${T.practice}`}
						start={18}
						stagger={6}
						duration={22}
						renderWord={(w) => (w === T.practice ? <span style={{color: practiceColor}}>{w}</span> : w)}
					/>
				</Line>
			</AbsoluteFill>
			<Sfx at={kCue - 16} name="tick" volume={0.5} />
			<Sfx at={kCue + 6} name="swipe" volume={0.45} />
			<Sfx at={pCue + 2} name="swipe" volume={0.4} />
			<Sfx at={pCue + 12} name="paper" volume={0.6} />
		</AbsoluteFill>
	);
};
