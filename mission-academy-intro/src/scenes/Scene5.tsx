// Scene 5 (34–43s) — «المعرفة تنمو بالمشاركة»
// Match cut from Scene 4's conference clipping. Callouts name who is there;
// the thread then runs out from under it and lifts three more clippings
// (discussion, workshop, audience). The camera pulls back: the collage is one
// cluster of a wider network that grows outward, its partnerships joined by
// the thread. Finally everything gathers along its links into one dot.
import {getLength, getPointAtLength} from '@remotion/paths';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import {Callout} from '../components/Callout';
import {Camera, CamKey, camAt, CamState, worldToScreen} from '../components/Camera';
import {Clip} from '../components/Clip';
import {Highlight} from '../components/Highlight';
import {Sfx} from '../components/Sfx';
import {ThreadPath} from '../components/ThreadPath';
import {Words} from '../components/Words';
import {Slot} from '../config/assets';
import {COLORS, THREAD, WEIGHT} from '../config/brand';
import {CANVAS, HANDOFF, SAFE} from '../config/layout';
import {cue, TEXT} from '../config/script';
import {focusPoint, ILLUSTRATIONS} from '../illustrations';
import {EASE, mix, mixPoint, mixRect, Point, prog, Rect} from '../motion';

const T = TEXT.s5;
const th = THREAD.width;
const DOT = HANDOFF.s5s6Dot;
const TITLE = {size: 80, weight: WEIGHT.display, top: 120, lead: 1.25};

// ---- Collage (world px; world == screen until the pull-back) ----
const CONF: Rect = {x: 600, y: 262, w: 640, h: 408};
const HC: Point = {x: CONF.x + CONF.w / 2, y: CONF.y + CONF.h / 2};
const BASE_Y = 790;
const GAP = 32;
const CORNER = 30;

type Sat = {
	slot: Slot;
	rect: Rect;
	tilt: number;
	d: string;
	/** Path length hidden under the conference clipping. */
	hidden: number;
	draw: number;
	note: string | null;
	label: Point;
};

const satRect = (x: number, w: number, h: number, lineY: number): Rect => ({x, y: lineY - GAP - h, w, h});
const D_RECT = satRect(1370, 390, 276, BASE_Y);
const W_RECT = satRect(170, 360, 250, HC.y);
const A_RECT = satRect(240, 330, 226, BASE_Y);

// Right → left in speaking order: discussion, workshop, audience.
const SATS: Sat[] = [
	{
		slot: 'discussion',
		rect: D_RECT,
		tilt: 1.6,
		d: `M ${HC.x} ${HC.y} L ${HC.x} ${BASE_Y - CORNER} Q ${HC.x} ${BASE_Y} ${HC.x + CORNER} ${BASE_Y} L ${D_RECT.x + D_RECT.w} ${BASE_Y}`,
		hidden: CONF.y + CONF.h - HC.y,
		draw: 54,
		note: T.notes[0],
		label: {x: D_RECT.x + D_RECT.w - 26, y: D_RECT.y - 46},
	},
	{
		slot: 'workshop',
		rect: W_RECT,
		tilt: -1.8,
		d: `M ${HC.x} ${HC.y} L ${W_RECT.x} ${HC.y}`,
		hidden: HC.x - CONF.x,
		draw: 76,
		note: T.notes[1],
		label: {x: W_RECT.x + W_RECT.w - 26, y: W_RECT.y - 42},
	},
	{
		slot: 'audience',
		rect: A_RECT,
		tilt: 1.2,
		d: `M ${HC.x} ${HC.y} L ${HC.x} ${BASE_Y - CORNER} Q ${HC.x} ${BASE_Y} ${HC.x - CORNER} ${BASE_Y} L ${A_RECT.x} ${BASE_Y}`,
		hidden: CONF.y + CONF.h - HC.y,
		draw: 98,
		note: null,
		label: {x: 0, y: 0},
	},
];
const SAT_LEN = SATS.map((s) => getLength(s.d));
const DRAW_DUR = 20;
const LIFT_AFTER = 16;

// ---- Camera ----
const S_NET = 0.42;
/** Where the collage's center sits on screen once the network is revealed. */
const NET_FOCUS: Point = {x: 930, y: 520};
const COLLAGE_C: Point = {x: (W_RECT.x + D_RECT.x + D_RECT.w) / 2, y: (W_RECT.y + BASE_Y) / 2};
const CAM_NET: Point = {
	x: COLLAGE_C.x - (NET_FOCUS.x - CANVAS.cx) / S_NET,
	y: COLLAGE_C.y - (NET_FOCUS.y - CANVAS.cy) / S_NET,
};
const S_END = 0.5;
const PULL = 146;
const PULL_END = 196;
const GATHER = 222;
const END = 266;
const CAM: CamKey[] = [
	{f: 0, x: CANVAS.cx, y: CANVAS.cy, s: 1},
	{f: PULL, x: CANVAS.cx, y: CANVAS.cy, s: 1},
	{f: PULL_END, ...CAM_NET, s: S_NET},
	{f: GATHER, x: CAM_NET.x - 6, y: CAM_NET.y + 4, s: S_NET * 1.02},
	// The conference's center lands exactly on the hand-off dot.
	{f: END, x: HC.x - (DOT.x - CANVAS.cx) / S_END, y: HC.y - (DOT.y - CANVAS.cy) / S_END, s: S_END},
];

const netScreen = (p: Point): Point => worldToScreen(p, {...CAM_NET, s: S_NET});
const netWorld = (q: Point): Point => ({
	x: CAM_NET.x + (q.x - CANVAS.cx) / S_NET,
	y: CAM_NET.y + (q.y - CANVAS.cy) / S_NET,
});
const rectToScreen = (r: Rect, cam: CamState): Rect => {
	const p = worldToScreen({x: r.x, y: r.y}, cam);
	return {x: p.x, y: p.y, w: r.w * cam.s, h: r.h * cam.s};
};
const center = (r: Rect): Point => ({x: r.x + r.w / 2, y: r.y + r.h / 2});
const dotRect = (p: Point, r: number): Rect => ({x: p.x - r, y: p.y - r, w: r * 2, h: r * 2});

/** A named detail of a clipping's illustration, in the clipping's space. */
const clipPoint = (slot: Slot, key: string, r: Rect, border: number, zoom = 1, tilt = 0): Point => {
	const f = focusPoint(slot, key);
	const iw = r.w - border * 2;
	const ih = r.h - border * 2;
	const S = Math.max(iw, ih);
	const x = iw / 2 + ((iw - S) / 2 + f.x * S - iw / 2) * zoom;
	const y = ih / 2 + ((ih - S) / 2 + f.y * S - ih / 2) * zoom;
	const p = {x: r.x + border + x, y: r.y + border + y};
	if (!tilt) return p;
	const a = (tilt * Math.PI) / 180;
	const c = center(r);
	return {
		x: c.x + (p.x - c.x) * Math.cos(a) - (p.y - c.y) * Math.sin(a),
		y: c.y + (p.x - c.x) * Math.sin(a) + (p.y - c.y) * Math.cos(a),
	};
};
const detailKey = (slot: Slot) => Object.keys(ILLUSTRATIONS[slot].focus).find((k) => k !== 'center') ?? 'center';

// ---- Network: partner hubs on a ring around the collage, each with a few
// satellites. Laid out on screen as it looks once revealed. ----
type NodeKind = 'dot' | 'chip' | 'clip';
type NetNode = {
	q: Point;
	p: Point;
	/** ≥ 0: another node; -1: conference; -2…-4: SATS[0…2]. */
	parent: number;
	depth: number;
	grow: number;
	kind: NodeKind;
	primary: boolean;
	slot: Slot | null;
	tilt: number;
	/** The link to the parent is a partnership: drawn as thread. */
	thread: boolean;
};

type HubSpec = {x: number; y: number; kind: NodeKind; slot?: Slot; dir: number; sats: number; spread: number};
// Clockwise from the right; the top-right stays clear for the title.
const HUBS: HubSpec[] = [
	{x: 1570, y: 520, kind: 'clip', slot: 'research', dir: 0, sats: 3, spread: 55},
	{x: 1450, y: 770, kind: 'dot', dir: 20, sats: 3, spread: 50},
	{x: 1090, y: 805, kind: 'chip', dir: -10, sats: 2, spread: 35},
	{x: 720, y: 800, kind: 'clip', slot: 'education', dir: 180, sats: 2, spread: 30},
	{x: 360, y: 720, kind: 'dot', dir: 160, sats: 3, spread: 50},
	{x: 300, y: 450, kind: 'clip', slot: 'training', dir: 180, sats: 3, spread: 50},
	{x: 430, y: 220, kind: 'chip', dir: 225, sats: 3, spread: 45},
	{x: 780, y: 190, kind: 'dot', dir: 270, sats: 2, spread: 40},
	{x: 1120, y: 200, kind: 'clip', slot: 'learning', dir: 270, sats: 2, spread: 50},
];
const CLIP_SIZE = {w: 108, h: 74};
const HUB_GROW = 166;
const CLIP_GROW = 180;

const ANCHOR_RECTS: Rect[] = [CONF, ...SATS.map((s) => s.rect)];
const ANCHOR_NET = ANCHOR_RECTS.map((r) => {
	const a = netScreen({x: r.x, y: r.y});
	return {x: a.x, y: a.y, w: r.w * S_NET, h: r.h * S_NET};
});
const rectDist = (q: Point, r: Rect) => {
	const dx = Math.max(r.x - q.x, 0, q.x - (r.x + r.w));
	const dy = Math.max(r.y - q.y, 0, q.y - (r.y + r.h));
	return Math.hypot(dx, dy);
};

const NODES: NetNode[] = (() => {
	const nodes: NetNode[] = [];
	// Grow outward: nearest hubs first (partnership clippings last).
	const reach = (h: HubSpec) => Math.hypot(h.x - NET_FOCUS.x, h.y - NET_FOCUS.y);
	const rank = (h: HubSpec) =>
		HUBS.filter((o) => (o.kind === 'clip') === (h.kind === 'clip') && reach(o) < reach(h)).length;
	HUBS.forEach((h, i) => {
		const q = {x: h.x, y: h.y};
		const anchor = ANCHOR_NET.map((r, k) => ({k, d: rectDist(q, r)})).sort((a, b) => a.d - b.d)[0];
		const isClip = h.kind === 'clip';
		nodes.push({
			q,
			p: netWorld(q),
			parent: -(anchor.k + 1),
			depth: 1,
			grow: isClip ? CLIP_GROW + 4 * rank(h) : HUB_GROW + 3 * rank(h),
			kind: h.kind,
			primary: true,
			slot: h.slot ?? null,
			tilt: (random(`s5-tilt-${i}`) - 0.5) * 5,
			thread: isClip,
		});
	});
	HUBS.forEach((h, i) => {
		const hub = nodes[i];
		const R = h.kind === 'clip' ? 112 : 92;
		for (let k = 0; k < h.sats; k++) {
			const t = h.sats === 1 ? 0 : k / (h.sats - 1) - 0.5;
			const a = ((h.dir + t * 2 * h.spread + (random(`s5-a-${i}-${k}`) - 0.5) * 12) * Math.PI) / 180;
			const r = R + (random(`s5-r-${i}-${k}`) - 0.5) * 14;
			const q = {x: h.x + Math.cos(a) * r, y: h.y + Math.sin(a) * r};
			nodes.push({
				q,
				p: netWorld(q),
				parent: i,
				depth: 2,
				grow: hub.grow + (h.kind === 'clip' ? 8 : 4) + k * 2,
				kind: 'dot',
				primary: random(`s5-p-${i}-${k}`) < 0.25,
				slot: null,
				tilt: 0,
				thread: false,
			});
		}
	});
	return nodes;
})();

const MAX_DEPTH = 2;
// Dashed "exchange" links: neighbouring hubs, and their closest satellites.
const CROSS: Array<[number, number]> = (() => {
	const out: Array<[number, number]> = [];
	const satsOf = (i: number) => NODES.map((n, j) => (n.parent === i ? j : -1)).filter((j) => j >= 0);
	for (let i = 0; i < HUBS.length - 1; i++) {
		out.push([i, i + 1]);
		let best: [number, number] | null = null;
		let bestD = 300;
		for (const a of satsOf(i)) {
			for (const b of satsOf(i + 1)) {
				const d = Math.hypot(NODES[a].q.x - NODES[b].q.x, NODES[a].q.y - NODES[b].q.y);
				if (d < bestD) {
					bestD = d;
					best = [a, b];
				}
			}
		}
		if (best) out.push(best);
	}
	return out;
})();

// ---- Gathering ----
const DEPTH_STEP = MAX_DEPTH > 1 ? 14 / (MAX_DEPTH - 1) : 0;
const collapseAt = (depth: number) => GATHER - 4 + (MAX_DEPTH - depth) * DEPTH_STEP;
const COLLAPSE_DUR = 12;
const SAT_MORPH = 240;
const SAT_RETRACT = 248;
const HUB_MORPH = 244;

/** 0→1 as v goes a→b (for sub-ranges of a 0–1 progress). */
const span = (v: number, a: number, b: number, easing: (t: number) => number = (t) => t) =>
	interpolate(v, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

const Line: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
	<div
		style={{
			position: 'absolute',
			right: CANVAS.width - SAFE.right,
			top,
			fontSize: TITLE.size,
			fontWeight: TITLE.weight,
			lineHeight: TITLE.lead,
			whiteSpace: 'nowrap',
			color: COLORS.ink,
		}}
	>
		{children}
	</div>
);

export const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const cam = camAt(frame, CAM);
	const ws = (p: Point) => worldToScreen(p, cam);
	const cPartners = cue('s5', 'partners');
	const cExchange = cue('s5', 'exchange');
	const cPartnerships = cue('s5', 'partnerships');

	// Conference: from the hand-off rect to its place in the collage, then
	// (at the very end) into the hand-off dot.
	const settle = prog(frame, 0, 28, EASE.inOut);
	const confWorld = mixRect(HANDOFF.s4s5Clip, CONF, settle);
	const zoom = mix(1, 1.05, prog(frame, 28, 150, EASE.soft));
	// Two steps so it becomes round early: rect → disc → the hand-off dot.
	const hubM = prog(frame, HUB_MORPH, 14, EASE.inOut);
	const hubDot = prog(frame, HUB_MORPH + 12, END - HUB_MORPH - 12, EASE.inOut);
	const confScreen = rectToScreen(confWorld, cam);
	const hubRect = mixRect(
		mixRect(confScreen, dotRect(center(confScreen), 34), hubM),
		dotRect(center(confScreen), DOT.r),
		hubDot,
	);
	const hubC = center(hubRect);

	// Satellite clippings: thread out from under the conference, lift, then
	// (gathering) fold back into a dot that rides the thread home.
	const sats = SATS.map((s, i) => {
		const visible = s.hidden / SAT_LEN[i];
		const out = prog(frame, s.draw, DRAW_DUR, EASE.inOut);
		const back = prog(frame, SAT_RETRACT + i * 2, 14, EASE.inOut);
		const to = frame < SAT_RETRACT ? (out > 0 ? mix(visible, 1, out) : 0) : 1 - back;
		const liftAt = s.draw + LIFT_AFTER;
		const lift = prog(frame, liftAt, 22, EASE.inOut);
		const reveal = prog(frame, liftAt + 7, 12, EASE.out);
		const seg: Rect = {x: s.rect.x, y: (s.slot === 'workshop' ? HC.y : BASE_Y) - th / 2, w: s.rect.w, h: th};
		const world = mixRect(seg, s.rect, lift);
		const morph = prog(frame, SAT_MORPH + i * 2, 10, EASE.inOut);
		const tip = getPointAtLength(s.d, Math.max(0, to) * SAT_LEN[i]);
		const tipScreen = ws(tip ?? HC);
		let rect = rectToScreen(world, cam);
		rect = mixRect(rect, dotRect(tipScreen, 9), morph);
		return {s, i, to, lift, reveal, morph, back, rect, world};
	});

	const anchorPos = (k: number): Point => (k === 0 ? hubC : center(sats[k - 1].rect));

	// Network node positions: each one gathers into its parent's current spot.
	const pos: Point[] = [];
	const collapse: number[] = [];
	NODES.forEach((n, i) => {
		const base = ws(n.p);
		const c = prog(frame, collapseAt(n.depth), COLLAPSE_DUR, EASE.inOut);
		const target = n.parent >= 0 ? pos[n.parent] : anchorPos(-n.parent - 1);
		pos.push(mixPoint(base, target, c));
		collapse.push(c);
	});
	const parentPos = (n: NetNode) => (n.parent >= 0 ? pos[n.parent] : anchorPos(-n.parent - 1));
	const fadeIn = (c: number) => 1 - span(c, 0.7, 1, EASE.in);
	const crossOut = 1 - prog(frame, GATHER - 6, 10, EASE.in);

	const calloutOut = 1 - prog(frame, PULL - 4, 14, EASE.in);
	const hl = prog(frame, cExchange - 2, 18, EASE.out);
	const titleExit = 206;
	const titleOut = prog(frame, titleExit, 12, EASE.in);

	const confPt = (key: string) => ws(clipPoint('conference', key, confWorld, 8, zoom));
	const speaker = confPt('speaker');
	const audience = confPt('audience');
	const audienceRight = audience.x > HC.x + 10;

	return (
		<AbsoluteFill>
			{/* Network links (screen px, ink-thin). */}
			<svg width={CANVAS.width} height={CANVAS.height} style={{position: 'absolute', left: 0, top: 0}}>
				{CROSS.map(([a, b]) => {
					const g = prog(frame, Math.min(Math.max(NODES[a].grow, NODES[b].grow) + 2, 200), 12, EASE.inOut);
					if (g <= 0 || crossOut <= 0) return null;
					const pa = pos[a];
					const pb = mixPoint(pos[a], pos[b], g);
					return (
						<line
							key={`x${a}-${b}`}
							x1={pa.x}
							y1={pa.y}
							x2={pb.x}
							y2={pb.y}
							stroke={COLORS.ink}
							strokeOpacity={0.3 * crossOut}
							strokeWidth={1.4}
							strokeDasharray="2 7"
							strokeLinecap="round"
						/>
					);
				})}
				{NODES.map((n, i) => {
					const g = prog(frame, n.grow - (n.thread ? 14 : 10), n.thread ? 14 : 10, EASE.inOut);
					if (g <= 0 || collapse[i] >= 1) return null;
					const from = parentPos(n);
					const to = mixPoint(from, pos[i], g);
					return (
						<line
							key={`e${i}`}
							x1={from.x}
							y1={from.y}
							x2={to.x}
							y2={to.y}
							stroke={n.thread ? THREAD.color : COLORS.ink}
							strokeOpacity={n.thread ? 1 : 0.42}
							strokeWidth={n.thread ? th * cam.s : 1.6}
							strokeLinecap="round"
						/>
					);
				})}
			</svg>

			{/* The collage's own thread, in world space. */}
			<Camera keys={CAM}>
				{sats.map(({s, to}) => (
					<ThreadPath key={s.slot} d={s.d} to={to} />
				))}
			</Camera>

			{/* Tiny clippings in the network. */}
			{NODES.map((n, i) => {
				if (n.kind !== 'clip' || !n.slot) return null;
				const unfold = prog(frame, n.grow - 4, 14, EASE.inOut);
				if (unfold <= 0) return null;
				const k = cam.s / S_NET;
				const w = CLIP_SIZE.w * k;
				const h = CLIP_SIZE.h * k;
				const c = pos[i];
				const full: Rect = {x: c.x - w / 2, y: c.y - h / 2, w, h};
				const line: Rect = {x: c.x - w / 2, y: c.y - (th * cam.s) / 2, w, h: th * cam.s};
				const reveal = prog(frame, n.grow, 8, EASE.out);
				const morph = prog(frame, collapseAt(n.depth) - 10, 10, EASE.inOut);
				const rect = mixRect(mixRect(line, full, unfold), dotRect(c, 8), morph);
				return (
					<Clip
						key={`c${i}`}
						rect={rect}
						slot={n.slot}
						border={mix(0, 8 * cam.s, reveal) * (1 - morph)}
						shadow={0.45 * reveal * (1 - morph)}
						tilt={n.tilt * unfold * (1 - morph)}
						radius={mix(mix((th * cam.s) / 2, 2, unfold), rect.w / 2, morph)}
						fill={COLORS.primary}
						contentOpacity={reveal * (1 - morph)}
						opacity={fadeIn(collapse[i])}
					/>
				);
			})}

			{/* Discussion, workshop, audience. */}
			{sats.map(({s, lift, reveal, morph, back, rect}) => {
				if (lift <= 0) return null;
				return (
					<Clip
						key={s.slot}
						rect={rect}
						slot={s.slot}
						border={mix(0, 8 * cam.s, reveal) * (1 - morph)}
						shadow={reveal * mix(1, 0.5, prog(frame, PULL, 50)) * (1 - morph)}
						tilt={s.tilt * lift * (1 - morph)}
						radius={mix(mix(th / 2, 3, lift) * cam.s, rect.w / 2, morph)}
						fill={COLORS.primary}
						contentOpacity={reveal * (1 - morph)}
						zoom={{scale: mix(1.15, 1, prog(frame, s.draw + LIFT_AFTER, 40, EASE.out)), x: 0.5, y: 0.5}}
						opacity={1 - span(back, 0.8, 1)}
					/>
				);
			})}

			{/* The conference: match cut in, gathering point out. */}
			<Clip
				rect={hubRect}
				slot="conference"
				border={8 * cam.s * (1 - span(hubM, 0, 0.5))}
				shadow={mix(1, 0.5, prog(frame, PULL, 50)) * (1 - span(hubM, 0, 0.6))}
				radius={mix(3 * cam.s, hubRect.w / 2, hubM)}
				fill={interpolateColors(hubM, [0, 0.5], [COLORS.mist, COLORS.primary])}
				contentOpacity={1 - span(hubM, 0, 0.4)}
				zoom={{scale: zoom, x: 0.5, y: 0.5}}
			/>

			{/* Network nodes (screen px). */}
			<svg width={CANVAS.width} height={CANVAS.height} style={{position: 'absolute', left: 0, top: 0}}>
				{NODES.map((n, i) => {
					if (n.kind === 'clip') return null;
					const pop = prog(frame, n.grow - 2, 9, EASE.out);
					if (pop <= 0) return null;
					const op = fadeIn(collapse[i]);
					if (op <= 0) return null;
					const {x, y} = pos[i];
					const shrink = mix(1, 0.7, collapse[i]);
					if (n.kind === 'chip') {
						const k = pop * shrink;
						return (
							<g key={`n${i}`} transform={`translate(${x} ${y}) scale(${k})`} opacity={op}>
								<rect x={-24} y={-15} width={48} height={30} rx={7} fill={COLORS.white} stroke={COLORS.ink} strokeOpacity={0.45} strokeWidth={1.5} />
								<circle cx={12} cy={0} r={5} fill={COLORS.primary} />
								<line x1={-14} y1={-4} x2={1} y2={-4} stroke={COLORS.light} strokeWidth={3.5} strokeLinecap="round" />
								<line x1={-14} y1={5} x2={-4} y2={5} stroke={COLORS.light} strokeWidth={3.5} strokeLinecap="round" />
							</g>
						);
					}
					return n.primary ? (
						<circle key={`n${i}`} cx={x} cy={y} r={9 * pop * shrink} fill={COLORS.primary} stroke={COLORS.white} strokeWidth={3} opacity={op} />
					) : (
						<circle key={`n${i}`} cx={x} cy={y} r={7 * pop * shrink} fill={COLORS.pale} stroke={COLORS.ink} strokeOpacity={0.55} strokeWidth={1.5} opacity={op} />
					);
				})}
			</svg>

			{/* Annotations: who is in the room, and what each clipping is. */}
			<Callout
				target={speaker}
				label={{x: speaker.x + 70, y: ws({x: 0, y: CONF.y - 50}).y}}
				text={T.notes[2]}
				progress={prog(frame, cPartners - 12, 26, (t) => t)}
				opacity={calloutOut}
			/>
			<Callout
				target={audience}
				label={{
					x: audience.x + (audienceRight ? 60 : -60),
					y: ws({x: 0, y: CONF.y + CONF.h + 56}).y,
				}}
				align={audienceRight ? 'right' : 'left'}
				text={T.notes[3]}
				progress={prog(frame, cPartners - 2, 26, (t) => t)}
				opacity={calloutOut}
			/>
			{sats.map(({s, world}) =>
				s.note ? (
					<Callout
						key={`note-${s.slot}`}
						target={ws(clipPoint(s.slot, detailKey(s.slot), world, 8, 1, s.tilt))}
						label={ws(s.label)}
						text={s.note}
						progress={prog(frame, s.draw + LIFT_AFTER + 14, 24, (t) => t)}
						opacity={calloutOut}
					/>
				) : null,
			)}

			{/* Title (screen space). */}
			<Line top={TITLE.top}>
				<Words text={T.title[0]} start={6} stagger={5} duration={20} exitAt={titleExit} exitDuration={12} />
			</Line>
			<Line top={TITLE.top + TITLE.size * TITLE.lead}>
				<span style={{opacity: 1 - titleOut}}>
					<Highlight progress={hl} variant="solid">
						<Words text={T.title[1]} start={14} duration={22} exitAt={titleExit} exitDuration={12} />
					</Highlight>
				</span>
			</Line>

			<Sfx at={2} name="swipe" volume={0.3} />
			<Sfx at={cPartners - 12} name="tick" volume={0.45} />
			<Sfx at={cPartners - 2} name="tick" volume={0.4} />
			{SATS.map((s) => [
				<Sfx key={`sw-${s.slot}`} at={s.draw} name="swipe" volume={0.3} />,
				<Sfx key={`pa-${s.slot}`} at={s.draw + LIFT_AFTER + 2} name="paper" volume={0.5} />,
			])}
			<Sfx at={cExchange - 2} name="tick" volume={0.5} />
			<Sfx at={PULL} name="whoosh" volume={0.45} />
			<Sfx at={HUB_GROW} name="pop" volume={0.2} />
			<Sfx at={CLIP_GROW} name="paper" volume={0.3} />
			<Sfx at={cPartnerships} name="pop" volume={0.35} />
			<Sfx at={GATHER} name="swipe" volume={0.4} />
			<Sfx at={END - 4} name="pop" volume={0.45} />
		</AbsoluteFill>
	);
};
