// Scene 4 (24–34s) — «مسارات تتكامل»
// The camera pulls out of Scene 3's node: it is the first stop of a path that
// runs right → left. At each stop the thread underlines the domain as it is
// named, and a clipping lifts out of the thread. Pulled back, the three stops
// read as one connected path; then the camera pushes into the conference
// clipping, which becomes Scene 5's opening frame.
import {getLength} from '@remotion/paths';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {camAt, CamKey, CamState, worldToScreen} from '../components/Camera';
import {Clip} from '../components/Clip';
import {Highlight} from '../components/Highlight';
import {Sfx} from '../components/Sfx';
import {Words} from '../components/Words';
import {Slot} from '../config/assets';
import {COLORS, THREAD, WEIGHT} from '../config/brand';
import {CANVAS, HANDOFF, SAFE} from '../config/layout';
import {cue, TEXT} from '../config/script';
import {EASE, mix, mixRect, Point, prog, Rect} from '../motion';

const T = TEXT.s4;
const th = THREAD.width;
const IN = HANDOFF.s3s4Node;
const OUT = HANDOFF.s4s5Clip;

// World units: the pulled-back shot is camera scale 1. The cut from Scene 3
// is the same node seen at 2.2× (22px screen stroke / 10px thread).
const S0 = IN.lineWidth / th;
const NODE_R = IN.r / S0;
const RING_R = (IN.r + IN.ring) / S0;

/** Each stop is a flat run of thread: node at its right end, label on it. */
const FLAT = 380;
const CLIP_W = 420;
const CLIP_H = (CLIP_W * OUT.h) / OUT.w;
const LABEL = 36;
/** Thread below the label's top, in em (clears ي / ر descenders). */
const UNDER = 1.45;
/** Labels are typeset at the close-up scale and scaled with the camera. */
const S_REF = 1.5;
const Y_HI = 485;
const Y_LO = 585;

type Stop = {slot: Slot; text: string; node: Point; above: boolean};
const STOPS: Stop[] = [
	{slot: 'education', text: T.tracks[0], node: {x: 1680, y: Y_HI}, above: false},
	{slot: 'research', text: T.tracks[1], node: {x: 1140, y: Y_LO}, above: true},
	{slot: 'conference', text: T.tracks[2], node: {x: 600, y: Y_HI}, above: false},
];

const labelTop = (s: Stop) => s.node.y - LABEL * UNDER;
const clipRect = (s: Stop): Rect => ({
	x: s.node.x - FLAT / 2 - CLIP_W / 2,
	y: s.above ? labelTop(s) - 18 - CLIP_H : s.node.y + 35,
	w: CLIP_W,
	h: CLIP_H,
});

// The path: in from off-screen right, flat under each stop, S-curves between.
const curve = (a: Point, b: Point) => {
	const mx = (a.x + b.x) / 2;
	return `C ${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
};
const flatEnd = (s: Stop): Point => ({x: s.node.x - FLAT, y: s.node.y});
const START: Point = {x: 2400, y: Y_HI};
const PATH = [
	`M ${START.x} ${START.y}`,
	`L ${flatEnd(STOPS[0]).x} ${Y_HI}`,
	curve(flatEnd(STOPS[0]), STOPS[1].node),
	`L ${flatEnd(STOPS[1]).x} ${Y_LO}`,
	curve(flatEnd(STOPS[1]), STOPS[2].node),
	`L ${flatEnd(STOPS[2]).x} ${Y_HI}`,
].join(' ');
const LEN = getLength(PATH);
const CURVE_LEN = getLength(`M ${flatEnd(STOPS[0]).x} ${Y_HI} ${curve(flatEnd(STOPS[0]), STOPS[1].node)}`);
/** Path length to node #1: what is already drawn at the cut. */
const TO_NODE1 = START.x - STOPS[0].node.x;

// End: the camera that frames the conference clipping exactly as Scene 5 opens.
const C3 = clipRect(STOPS[2]);
const S_END = OUT.w / C3.w;
const CAM_END = {
	x: C3.x + C3.w / 2 - (OUT.x + OUT.w / 2 - CANVAS.cx) / S_END,
	y: C3.y + C3.h / 2 - (OUT.y + OUT.h / 2 - CANVAS.cy) / S_END,
	s: S_END,
};

/** The camera leaves each stop at these frames. */
const LEAVE = [46, 90, 142];
const WIDE = 184;
const PUSH = 250;
const LAND = 292;

const CAM: CamKey[] = [
	{f: 0, x: STOPS[0].node.x, y: Y_HI, s: S0},
	{f: 34, x: 1490, y: 610, s: 1.5},
	{f: LEAVE[0], x: 1480, y: 610, s: 1.5},
	{f: 80, x: 950, y: 418, s: 1.5},
	{f: LEAVE[1], x: 940, y: 418, s: 1.5},
	{f: 124, x: 410, y: 610, s: 1.5},
	{f: LEAVE[2], x: 400, y: 610, s: 1.5},
	{f: WIDE, x: 960, y: 524, s: 1},
	{f: PUSH, x: 960, y: 522, s: 1.025},
	{f: LAND, ...CAM_END},
];

const toScreen = (r: Rect, cam: CamState): Rect => {
	const p = worldToScreen(r, cam);
	return {x: p.x, y: p.y, w: r.w * cam.s, h: r.h * cam.s};
};

const TITLE = {size: 84, top: 118};

export const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const cam = camAt(frame, CAM);
	const cues = [cue('s4', 'education'), cue('s4', 'research'), cue('s4', 'events')];
	const iCue = cue('s4', 'integrate');

	// Thread: the leading edge reaches each node, then underlines its label.
	const arrive = [0, cues[1] - 28, cues[2] - 28];
	const underline = cues.map((c) => c - 14);
	let drawn = TO_NODE1;
	STOPS.forEach((_, i) => {
		if (i > 0) drawn += CURVE_LEN * prog(frame, arrive[i], 14, EASE.inOut);
		drawn += FLAT * prog(frame, underline[i], 16, EASE.out);
	});

	const guide = prog(frame, 6, 20, EASE.soft);
	const worldOut = 1 - prog(frame, PUSH + 2, 20, EASE.soft);
	const labelsOut = 1 - prog(frame, PUSH, 16, EASE.soft);
	const title = T.title.split(' ');
	const key = title.pop() as string;

	return (
		<AbsoluteFill>
			<svg
				width={CANVAS.width}
				height={CANVAS.height}
				style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: worldOut}}
			>
				<g
					transform={`translate(${CANVAS.cx - cam.x * cam.s} ${CANVAS.cy - cam.y * cam.s}) scale(${cam.s})`}
				>
					{/* The route ahead, as a faint dotted guide. */}
					<path
						d={PATH}
						fill="none"
						stroke={COLORS.light}
						strokeWidth={4}
						strokeLinecap="round"
						strokeDasharray="0 15"
						opacity={guide}
					/>
					<path
						d={PATH}
						fill="none"
						stroke={THREAD.color}
						strokeWidth={th}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeDasharray={`${drawn} ${LEN + th * 4}`}
					/>
					{STOPS.map((s, i) => {
						const pop = i === 0 ? 1 : prog(frame, arrive[i] + 10, 10, EASE.out);
						return (
							<g key={s.slot}>
								{pop < 1 ? (
									<circle
										cx={s.node.x}
										cy={s.node.y}
										r={NODE_R * 0.7}
										fill={COLORS.paper}
										stroke={COLORS.light}
										strokeWidth={3}
										opacity={guide}
									/>
								) : null}
								{pop > 0 ? (
									<>
										<circle cx={s.node.x} cy={s.node.y} r={RING_R * pop} fill={COLORS.white} />
										<circle cx={s.node.x} cy={s.node.y} r={NODE_R * pop} fill={COLORS.primary} />
									</>
								) : null}
							</g>
						);
					})}
				</g>
			</svg>
			{STOPS.map((s, i) => {
				const c = cues[i];
				// A segment lifts off the thread to the clipping's edge, then unfolds.
				const lift = prog(frame, c - 6, 9, EASE.inOut);
				const unfold = prog(frame, c, 18, EASE.inOut);
				if (lift <= 0) return null;
				const box = clipRect(s);
				const line: Rect = {x: s.node.x - FLAT, y: s.node.y - th / 2, w: FLAT - RING_R - 8, h: th};
				const edge: Rect = {...line, y: s.above ? box.y + box.h - th : box.y};
				let rect = toScreen(mixRect(mixRect(line, edge, lift), box, unfold), cam);
				const reveal = prog(frame, c + 3, 12, EASE.out);
				const last = i === STOPS.length - 1;
				if (last) rect = mixRect(rect, OUT, prog(frame, LAND - 8, 8, EASE.inOut));
				return (
					<Clip
						key={s.slot}
						rect={rect}
						slot={s.slot}
						border={mix(0, 8, reveal)}
						shadow={reveal}
						radius={mix((th / 2) * cam.s, 3, unfold)}
						fill={reveal < 1 ? COLORS.primary : COLORS.mist}
						contentOpacity={reveal}
						zoom={{scale: mix(1.15, 1, prog(frame, c + 3, 30, EASE.out)), x: 0.5, y: 0.5}}
						opacity={last ? 1 : 1 - prog(frame, PUSH, 18, EASE.soft)}
					/>
				);
			})}
			{STOPS.map((s, i) => {
				// One focal point: a stop's label steps back as the camera leaves it,
				// and returns as the pull-back shows all three together.
				const away = prog(frame, LEAVE[i] + 14, 12, EASE.soft);
				const back = prog(frame, LEAVE[2] + 28 - i * 12, 14, EASE.soft);
				const shown = i === STOPS.length - 1 ? 1 : 1 - away + back;
				const active = prog(frame, underline[i], 8, EASE.out) - away;
				const anchor = worldToScreen({x: s.node.x - RING_R - 18, y: labelTop(s)}, cam);
				return (
					<div
						key={s.text}
						style={{
							position: 'absolute',
							right: CANVAS.width - anchor.x,
							top: anchor.y,
							transform: `scale(${cam.s / S_REF})`,
							transformOrigin: 'right top',
							fontSize: LABEL * S_REF,
							fontWeight: WEIGHT.title,
							lineHeight: 1.25,
							whiteSpace: 'nowrap',
							color: interpolateColors(active, [0, 1], [COLORS.ink, COLORS.primary]),
							opacity: labelsOut * shown,
						}}
					>
						<Words text={s.text} start={underline[i] - 2} stagger={4} duration={18} />
					</div>
				);
			})}
			<div
				style={{
					position: 'absolute',
					right: CANVAS.width - SAFE.right,
					top: TITLE.top,
					fontSize: TITLE.size,
					fontWeight: WEIGHT.display,
					lineHeight: 1.25,
					whiteSpace: 'nowrap',
					color: COLORS.ink,
				}}
			>
				<Words text={title.join(' ')} start={iCue - 16} duration={22} exitAt={PUSH - 6} exitDuration={12} />{' '}
				<Highlight progress={prog(frame, iCue, 14, EASE.out) - prog(frame, PUSH - 8, 10, EASE.in)}>
					<Words text={key} start={iCue - 8} duration={22} exitAt={PUSH - 8} exitDuration={12} />
				</Highlight>
			</div>
			<Sfx at={2} name="whoosh" volume={0.35} />
			<Sfx at={underline[0]} name="tick" volume={0.4} />
			<Sfx at={cues[0] - 2} name="paper" volume={0.5} />
			<Sfx at={arrive[1] - 6} name="swipe" volume={0.35} />
			<Sfx at={arrive[1] + 10} name="pop" volume={0.3} />
			<Sfx at={cues[1] - 2} name="paper" volume={0.5} />
			<Sfx at={arrive[2] - 6} name="swipe" volume={0.35} />
			<Sfx at={arrive[2] + 10} name="pop" volume={0.3} />
			<Sfx at={cues[2] - 2} name="paper" volume={0.5} />
			<Sfx at={LEAVE[2] + 2} name="whoosh" volume={0.35} />
			<Sfx at={iCue} name="tick" volume={0.45} />
			<Sfx at={PUSH} name="whoosh" volume={0.4} />
		</AbsoluteFill>
	);
};
