// Scene 3 (12–24s) — «تدريب صحي وتطوير مهني»
// Scene 2's thread becomes the title's underline, drops from its end and
// unfolds into a practitioner at the centre. From there it reaches out to three
// training clippings (knowledge, skill, application), each annotated as it is
// spoken. The camera then looks closely at the skill; the clipping folds back
// into the thread, which runs on into a single node (match cut to Scene 4).
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {Callout} from '../components/Callout';
import {camAt, Camera, CamKey, worldToScreen} from '../components/Camera';
import {Clip} from '../components/Clip';
import {Highlight} from '../components/Highlight';
import {Sfx} from '../components/Sfx';
import {ThreadPath} from '../components/ThreadPath';
import {Words} from '../components/Words';
import {PHOTOS, Slot} from '../config/assets';
import {COLORS, THREAD, WEIGHT} from '../config/brand';
import {CANVAS, HANDOFF, SAFE} from '../config/layout';
import {cue, TEXT} from '../config/script';
import {focusPoint} from '../illustrations';
import {EASE, mix, mixRect, Point, prog, Rect} from '../motion';
import {textWidth} from '../measure';

const T = TEXT.s3;
const LINE = HANDOFF.s2s3Line;
const END = HANDOFF.s3s4Node;
const th = THREAD.width;
const BORDER = 8;

const TITLE_SIZE = 80;
/** Underline offset below the title box's top, as a fraction of font size
 * (clear of the deep descenders of «ي»). */
const UNDER = 1.55;
const TITLE_TOP = LINE.y - TITLE_SIZE * UNDER;
/** Extra depth for the highlight strip so it holds the descenders. */
const DESC = '0.2em';
/** Corner radius where the underline turns down towards the portrait. */
const TURN = 26;

const PRAC: Rect = {x: CANVAS.cx - 230, y: 318, w: 460, h: 540};
/** Branches leave from inside the portrait so they emerge from its edge. */
const INSET = 70;

type Sat = {
	slot: Slot;
	note: string;
	/** Frame at which the note's word is spoken. */
	at: number;
	rect: Rect;
	tilt: number;
	/** Where the branch leaves the portrait (y) and runs across the clipping (y). */
	fromY: number;
	y: number;
	/** Label anchor of the callout (the pill extends to its left). */
	label: Point;
};

const KNOW: Sat = {
	slot: 'knowledge',
	note: T.notes.knowledge,
	at: cue('s3', 'knowledge'),
	rect: {x: 1300, y: 436, w: 368, h: 252},
	tilt: 1.5,
	fromY: 520,
	y: 562,
	label: {x: 1690, y: 388},
};
const SKILL: Sat = {
	slot: 'skill',
	note: T.notes.skill,
	at: cue('s3', 'skills'),
	rect: {x: 270, y: 300, w: 368, h: 252},
	tilt: -1.5,
	fromY: 426,
	y: 426,
	label: {x: 430, y: 256},
};
const APPLY: Sat = {
	slot: 'apply',
	note: T.notes.apply,
	at: 258,
	rect: {x: 312, y: 612, w: 368, h: 248},
	tilt: 1.2,
	fromY: 700,
	y: 736,
	label: {x: 296, y: 668},
};
const SATS = [KNOW, SKILL, APPLY];

const side = (s: Sat) => (s.rect.x > PRAC.x ? 1 : -1);
const branchStart = (s: Sat) => (side(s) > 0 ? PRAC.x + PRAC.w - INSET : PRAC.x + INSET);

/** Branch from inside the portrait, out of its edge, across the clipping. */
const branchPath = (s: Sat) => {
	const dir = side(s);
	const edge = dir > 0 ? PRAC.x + PRAC.w : PRAC.x;
	const near = dir > 0 ? s.rect.x : s.rect.x + s.rect.w;
	const far = dir > 0 ? s.rect.x + s.rect.w - th / 2 : s.rect.x + th / 2;
	const mid = (edge + near) / 2;
	return `M ${branchStart(s)} ${s.fromY} L ${edge} ${s.fromY} C ${mid} ${s.fromY}, ${mid} ${s.y}, ${near} ${s.y} L ${far} ${s.y}`;
};
const dashOf = (s: Sat): Rect => ({x: s.rect.x, y: s.y - th / 2, w: s.rect.w, h: th});

/** Illustrations draw in a square viewBox shown with "cover": map a focus point to box fractions. */
const coverFocus = (slot: Slot, key: string, w: number, h: number): Point => {
	const f = focusPoint(slot, key);
	if (PHOTOS[slot]) return f;
	const s = Math.max(w, h);
	return {x: (f.x * s - (s - w) / 2) / w, y: (f.y * s - (s - h) / 2) / h};
};

const rotate = (p: Point, c: Point, deg: number): Point => {
	const a = (deg * Math.PI) / 180;
	const dx = p.x - c.x;
	const dy = p.y - c.y;
	return {x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a)};
};

/** A focus point of a clipping in world px (inside the border, following its tilt). */
const detailOf = (s: Sat): {zoom: Point; world: Point} => {
	const iw = s.rect.w - BORDER * 2;
	const ih = s.rect.h - BORDER * 2;
	const z = coverFocus(s.slot, 'detail', iw, ih);
	const p = {x: s.rect.x + BORDER + z.x * iw, y: s.rect.y + BORDER + z.y * ih};
	const c = {x: s.rect.x + s.rect.w / 2, y: s.rect.y + s.rect.h / 2};
	return {zoom: z, world: rotate(p, c, s.tilt)};
};

// Timeline (local frames).
const DROP = 34;
const UNFOLD = 52;
const ZOOM = 300;
const OUT = 340;
const LAST = 359;

/** The final node: where the thread leaves the skill clipping, to its left. */
const NODE: Point = {x: SKILL.rect.x - 100, y: SKILL.y};
const END_SCALE = END.lineWidth / th;
const SKILL_DETAIL = detailOf(SKILL).world;

const CAM: CamKey[] = [
	{f: 0, x: CANVAS.cx, y: CANVAS.cy, s: 1},
	// A gentle drift that keeps the title's right edge on SAFE.right.
	{f: ZOOM, x: 980, y: 548, s: (SAFE.right - CANVAS.cx) / (SAFE.right - 980)},
	{f: 330, x: SKILL_DETAIL.x, y: SKILL_DETAIL.y, s: 1.8},
	{f: LAST, x: NODE.x, y: NODE.y, s: END_SCALE},
];

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const cam = camAt(frame, CAM);

	// Title + underline: the line adjusts its length to the measured title.
	const w = (t: string) => textWidth(t, TITLE_SIZE, WEIGHT.display);
	const titleW = w(`${T.title[0]} ${T.title[1]}`);
	const gap = titleW - w(T.title[0]) - w(T.title[1]);
	const titleLeft = LINE.xRight - titleW;
	const lineLeft = mix(LINE.xLeft, titleLeft, prog(frame, 4, 24, EASE.inOut));
	const hHealth = prog(frame, cue('s3', 'health') - 6, 16, EASE.out);
	const hPro = prog(frame, cue('s3', 'professional') - 6, 16, EASE.out);
	// Once both are spoken the strips calm down to pale, handing focus to the portrait.
	const calm = prog(frame, cue('s3', 'practitioners') - 26, 18, EASE.soft);
	const strip = interpolateColors(calm, [0, 1], [COLORS.primary, COLORS.pale]);
	const tone = (word: string) =>
		calm > 0 ? <span style={{color: interpolateColors(calm, [0.4, 0.6], [COLORS.white, COLORS.ink])}}>{word}</span> : word;
	const away = 1 - prog(frame, ZOOM, 14, EASE.soft);

	// The thread turns down at the underline's end and unfolds into the portrait.
	const dropX = titleLeft - TURN;
	const dropD = `M ${titleLeft} ${LINE.y} Q ${dropX} ${LINE.y}, ${dropX} ${LINE.y + TURN} L ${dropX} ${PRAC.y + PRAC.h - th / 2}`;
	const drop = prog(frame, DROP, 22, EASE.inOut);
	const unfold = prog(frame, UNFOLD, 26, EASE.inOut);
	const pracDash: Rect = {x: dropX - th / 2, y: PRAC.y, w: th, h: PRAC.h};
	const pracRect = mixRect(pracDash, PRAC, unfold);
	const pracReveal = prog(frame, UNFOLD + 10, 14, EASE.out);
	const face = coverFocus('practitioner', 'face', PRAC.w - BORDER * 2, PRAC.h - BORDER * 2);
	const pracZoom =
		mix(1.16, 1, prog(frame, UNFOLD + 8, 44, EASE.out)) *
		mix(1, 1.2, prog(frame, cue('s3', 'practitioners') - 16, 50, EASE.inOut));

	// Exit: the skill clipping folds back into the thread, which runs on to the node.
	const fade = 1 - prog(frame, OUT + 2, 12, EASE.inOut);
	const fold = prog(frame, OUT, 14, EASE.inOut);
	const reach = prog(frame, OUT + 2, 14, EASE.inOut);
	const pop = prog(frame, OUT + 12, 7, EASE.out);

	// Skill branch, drawn in SCREEN space so the end state is exact.
	const skillDraw = prog(frame, SKILL.at - 46, 18, EASE.inOut);
	// It starts deep inside the portrait, so its end never shows while the portrait fades.
	const skillTail = PRAC.x + PRAC.w - INSET;
	const skillLead = mix(mix(branchStart(SKILL), SKILL.rect.x + th / 2, skillDraw), NODE.x, reach);
	const sl = worldToScreen({x: skillLead, y: SKILL.y}, cam);
	const sr = worldToScreen({x: skillTail, y: SKILL.y}, cam);
	const sw = th * cam.s;
	const node = worldToScreen(NODE, cam);
	const nodeR = (END.r / END_SCALE) * cam.s * pop;
	const ringR = ((END.r + END.ring) / END_SCALE) * cam.s * pop;

	return (
		<AbsoluteFill>
			<Camera keys={CAM}>
				<ThreadPath d={dropD} to={drop} opacity={away} />
				{SATS.filter((s) => s !== SKILL).map((s) => (
					<ThreadPath
						key={s.slot}
						d={branchPath(s)}
						to={prog(frame, s.at - 46, 18, EASE.inOut)}
						opacity={fade}
					/>
				))}
			</Camera>
			{skillDraw > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: sl.x - sw / 2,
						top: sl.y - sw / 2,
						width: Math.max(sw, sr.x - sl.x + sw),
						height: sw,
						borderRadius: sw / 2,
						background: THREAD.color,
					}}
				/>
			) : null}
			<Camera keys={CAM}>
				{unfold > 0 ? (
					<Clip
						rect={pracRect}
						slot="practitioner"
						border={mix(0, BORDER, pracReveal)}
						shadow={pracReveal}
						radius={mix(th / 2, 3, unfold)}
						fill={COLORS.primary}
						contentOpacity={pracReveal}
						zoom={{scale: pracZoom, x: face.x, y: face.y}}
						opacity={fade}
					/>
				) : null}
				{SATS.map((s) => {
					const lift = prog(frame, s.at - 32, 20, EASE.inOut);
					if (lift <= 0) return null;
					const reveal = prog(frame, s.at - 24, 12, EASE.out);
					const d = detailOf(s);
					const isSkill = s === SKILL;
					const back = isSkill ? fold : 0;
					const content = Math.min(reveal, isSkill ? 1 - prog(frame, OUT + 4, 8, EASE.soft) : 1);
					const look = isSkill ? prog(frame, ZOOM + 4, OUT - ZOOM + 6, EASE.inOut) : 0;
					const rect = mixRect(mixRect(dashOf(s), s.rect, lift), dashOf(s), back);
					return (
						<Clip
							key={s.slot}
							rect={rect}
							slot={s.slot}
							tilt={mix(0, s.tilt, lift * (1 - back))}
							border={mix(0, BORDER, Math.min(reveal, 1 - back))}
							shadow={Math.min(reveal, 1 - back)}
							radius={mix(th / 2, 3, Math.min(lift, 1 - back))}
							fill={COLORS.primary}
							contentOpacity={content}
							zoom={{scale: mix(1.14, 1, prog(frame, s.at - 22, 40, EASE.out)) * mix(1, 1.3, look), x: d.zoom.x, y: d.zoom.y}}
							opacity={isSkill ? 1 - prog(frame, OUT + 12, 4, EASE.soft) : fade}
						/>
					);
				})}
				<div
					style={{
						position: 'absolute',
						right: CANVAS.width - LINE.xRight,
						top: TITLE_TOP,
						fontSize: TITLE_SIZE,
						fontWeight: WEIGHT.display,
						lineHeight: 1.25,
						whiteSpace: 'nowrap',
						color: COLORS.ink,
						opacity: away,
					}}
				>
					{/* The gap between the phrases sits inside the first strip so the two strips join cleanly. */}
					<Highlight progress={hHealth} color={strip}>
						<span style={{display: 'inline-block', marginLeft: gap, paddingBottom: DESC}}>
							<Words text={T.title[0]} start={0} stagger={4} duration={20} renderWord={tone} />
						</span>
					</Highlight>
					<Highlight progress={hPro} color={strip}>
						<span style={{display: 'inline-block', paddingBottom: DESC}}>
							<Words text={T.title[1]} start={8} stagger={4} duration={20} renderWord={tone} />
						</span>
					</Highlight>
				</div>
				<div
					style={{
						position: 'absolute',
						left: lineLeft,
						width: LINE.xRight - lineLeft,
						top: LINE.y - th / 2,
						height: th,
						borderRadius: th / 2,
						background: THREAD.color,
						opacity: away,
					}}
				/>
				{SATS.map((s) => (
					<Callout
						key={s.slot}
						target={detailOf(s).world}
						label={s.label}
						text={s.note}
						progress={prog(frame, s.at - 12, 24, (t) => t)}
						fontSize={32}
						opacity={s === SKILL ? 1 - prog(frame, OUT, 10, EASE.soft) : away}
					/>
				))}
			</Camera>
			{pop > 0 ? (
				<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
					<circle cx={node.x} cy={node.y} r={ringR} fill={COLORS.white} />
					<circle cx={node.x} cy={node.y} r={nodeR} fill={COLORS.primary} />
				</svg>
			) : null}
			<Sfx at={DROP} name="swipe" volume={0.35} />
			<Sfx at={UNFOLD + 2} name="paper" volume={0.55} />
			<Sfx at={cue('s3', 'health') - 6} name="tick" volume={0.4} />
			<Sfx at={cue('s3', 'professional') - 6} name="tick" volume={0.4} />
			{SATS.map((s) => (
				<Sfx key={`p-${s.slot}`} at={s.at - 32} name="paper" volume={0.4} />
			))}
			{SATS.map((s) => (
				<Sfx key={`t-${s.slot}`} at={s.at - 10} name="tick" volume={0.35} />
			))}
			<Sfx at={ZOOM} name="whoosh" volume={0.4} />
			<Sfx at={OUT + 2} name="swipe" volume={0.35} />
			<Sfx at={OUT + 12} name="pop" volume={0.5} />
		</AbsoluteFill>
	);
};
