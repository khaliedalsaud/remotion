// Scene 2 (5–12s) — «تعلّم. طبّق. تطوّر.»
// Match cut from Scene 1's window. The thread runs beneath the three steps and
// lifts a clipping out of itself for each one. The three clippings then become
// the three bars of the Mission mark, which resolves into the original logo.
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {Clip} from '../components/Clip';
import {LogoMark, logoBarRects} from '../components/LogoMark';
import {Sfx} from '../components/Sfx';
import {Words} from '../components/Words';
import {Slot} from '../config/assets';
import {COLORS, LOGO, THREAD, WEIGHT} from '../config/brand';
import {CANVAS, HANDOFF} from '../config/layout';
import {cue, TEXT} from '../config/script';
import {EASE, mix, mixRect, prog, Rect} from '../motion';

const T = TEXT.s2;
const SLOT_W = 420;
const SLOT_H = 470;
const SLOT_Y = 150;
const WORD_TOP = 650;
const WORD_SIZE = 104;
const LINE_Y = WORD_TOP + WORD_SIZE * 1.48;

// Right → left in reading order.
const STEPS: Array<{slot: Slot; word: string; x: number; bar: number}> = [
	{slot: 'training', word: T.learn, x: 1300, bar: 2},
	{slot: 'practice', word: T.apply, x: 750, bar: 1},
	{slot: 'interaction', word: T.grow, x: 200, bar: 0},
];
const slotRect = (x: number): Rect => ({x, y: SLOT_Y, w: SLOT_W, h: SLOT_H});

const LOGO_H = 300;
const LOGO_X = CANVAS.cx - (LOGO_H * LOGO.aspect) / 2;
const LOGO_Y = 190;
const BARS = logoBarRects(LOGO_X, LOGO_Y, LOGO_H);

const MORPH = 132;
const EXIT = 184;

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	const th = THREAD.width;
	const cues = [cue('s2', 'learn'), cue('s2', 'apply'), cue('s2', 'grow')];
	// Each step: [word reveal, line arrives under the slot, clipping lifts].
	const stepStart = [cues[0] - 10, cues[1] - 6, cues[2] - 6];

	// Thread: draws under step 1, then extends leftwards to each next step.
	const lineReach = [
		mix(STEPS[0].x + SLOT_W, STEPS[0].x, prog(frame, stepStart[0] + 2, 16, EASE.out)),
		mix(STEPS[0].x, STEPS[1].x, prog(frame, stepStart[1] - 18, 22, EASE.inOut)),
		mix(STEPS[1].x, STEPS[2].x, prog(frame, stepStart[2] - 18, 22, EASE.inOut)),
	];
	let lineLeft = lineReach[0];
	if (frame >= stepStart[1] - 18) lineLeft = lineReach[1];
	if (frame >= stepStart[2] - 18) lineLeft = lineReach[2];
	let lineRight = STEPS[0].x + SLOT_W;
	let lineY = LINE_Y;
	const glide = prog(frame, EXIT, 25, EASE.inOut);
	lineLeft = mix(lineLeft, HANDOFF.s2s3Line.xLeft, glide);
	lineRight = mix(lineRight, HANDOFF.s2s3Line.xRight, glide);
	lineY = mix(lineY, HANDOFF.s2s3Line.y, glide);

	const exitFade = 1 - prog(frame, EXIT, 14, EASE.in);
	// The words leave first so the rising thread never strikes through them.
	const wordFade = 1 - prog(frame, EXIT - 12, 12, EASE.soft);
	const logoIn = prog(frame, MORPH + 36, 10, EASE.soft);
	const pillsOut = prog(frame, MORPH + 42, 8, EASE.soft);

	return (
		<AbsoluteFill>
			{STEPS.map((step, i) => {
				const bar = BARS[step.bar];
				const barRect: Rect = {x: bar.x, y: bar.y, w: bar.w, h: bar.h};
				let rect: Rect;
				let reveal = 1;
				if (i === 0) {
					// Match cut: Scene 1's window glides into the first slot.
					rect = mixRect(HANDOFF.s1s2Window, slotRect(step.x), prog(frame, 0, 24, EASE.inOut));
				} else {
					const lift = prog(frame, stepStart[i] - 4, 22, EASE.inOut);
					if (lift <= 0) return null;
					const fromLine: Rect = {x: step.x, y: LINE_Y - th / 2, w: SLOT_W, h: th};
					rect = mixRect(fromLine, slotRect(step.x), lift);
					reveal = prog(frame, stepStart[i] + 4, 12, EASE.out);
				}
				const m = prog(frame, MORPH + i * 4, 34, EASE.inOut);
				rect = mixRect(rect, barRect, m);
				const content = Math.min(reveal, 1 - prog(frame, MORPH + 16 + i * 4, 14, EASE.soft));
				return (
					<Clip
						key={step.slot}
						rect={rect}
						slot={step.slot}
						border={mix(i === 0 ? 8 : mix(0, 8, reveal), 0, prog(frame, MORPH + i * 4, 14))}
						shadow={(i === 0 ? 1 : reveal) * (1 - m)}
						radius={mix(i === 0 ? 3 : mix(th / 2, 3, reveal), bar.w / 2, m)}
						fill={m > 0 ? interpolateColors(m, [0, 0.6], [COLORS.primary, bar.color]) : COLORS.primary}
						contentOpacity={content}
						opacity={(1 - pillsOut) * exitFade}
					/>
				);
			})}
			<LogoMark x={LOGO_X} y={LOGO_Y} height={LOGO_H} opacity={logoIn * exitFade} />
			{STEPS.map((step, i) => {
				const active = frame >= stepStart[i] && (i === 2 || frame < stepStart[i + 1]) && frame < MORPH;
				const color = interpolateColors(active ? 1 : 0, [0, 1], [COLORS.ink, COLORS.primary]);
				return (
					<div
						key={step.word}
						style={{
							position: 'absolute',
							left: step.x,
							width: SLOT_W,
							top: WORD_TOP,
							textAlign: 'center',
							fontSize: WORD_SIZE,
							fontWeight: WEIGHT.display,
							lineHeight: 1.25,
							color,
							opacity: wordFade,
						}}
					>
						<Words text={step.word} start={stepStart[i]} duration={20} />
					</div>
				);
			})}
			<div
				style={{
					position: 'absolute',
					left: lineLeft,
					width: Math.max(0, lineRight - lineLeft),
					top: lineY - th / 2,
					height: th,
					borderRadius: th / 2,
					background: THREAD.color,
				}}
			/>
			<Sfx at={2} name="swipe" volume={0.4} />
			<Sfx at={stepStart[0] + 2} name="tick" volume={0.45} />
			<Sfx at={stepStart[1] - 18} name="swipe" volume={0.35} />
			<Sfx at={stepStart[1] - 4} name="paper" volume={0.5} />
			<Sfx at={stepStart[2] - 18} name="swipe" volume={0.35} />
			<Sfx at={stepStart[2] - 4} name="paper" volume={0.5} />
			<Sfx at={MORPH} name="whoosh" volume={0.45} />
			<Sfx at={MORPH + 34} name="swell" volume={0.55} />
			<Sfx at={EXIT} name="swipe" volume={0.4} />
		</AbsoluteFill>
	);
};
