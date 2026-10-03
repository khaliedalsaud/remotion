// Shared vocabulary for the editorial illustrations. Every illustration draws
// in a 1200×1200 viewBox, shown with "slice" (cover) inside clippings, so the
// key subject must sit in the central safe area (x 150–1050, y 250–950).
//
// Style rules: flat geometric shapes in the brand blues, thin ink linework on
// objects, halftone-dot texture for shade (echoes the dot pattern around the
// supplied logo). Figures are abstract and faceless. No red crosses, pulse
// lines, pills or repeated generic medical icons.
import {createContext, useContext, useId} from 'react';
import {COLORS} from '../config/brand';

export const VIEW = 1200;

export const PAL = {
	primary: COLORS.primary,
	deep: COLORS.deep,
	mid: COLORS.mid,
	light: COLORS.light,
	pale: COLORS.pale,
	mist: COLORS.mist,
	white: COLORS.white,
	ink: COLORS.ink,
	inkSoft: COLORS.inkSoft,
	/** Neutral face/hand tone for the abstract figures. */
	skin: '#C9D6EE',
	paper: '#FBFCFE',
} as const;

/** Global frame, provided by the root composition, for ambient motion that
 * must not restart when the same illustration appears in another scene. */
export const IllustrationClock = createContext(0);
export const useAmbientFrame = () => useContext(IllustrationClock);

/** Unique, url()-safe ids for <defs> (several SVGs share one DOM). */
export const useIds = <K extends string>(...names: K[]): Record<K, string> => {
	const base = useId().replace(/[^a-zA-Z0-9]/g, '');
	return Object.fromEntries(names.map((n) => [n, `${n}${base}`])) as Record<K, string>;
};

export const Frame: React.FC<{bg?: string; children: React.ReactNode}> = ({
	bg = PAL.mist,
	children,
}) => (
	<svg
		viewBox={`0 0 ${VIEW} ${VIEW}`}
		preserveAspectRatio="xMidYMid slice"
		width="100%"
		height="100%"
		style={{display: 'block'}}
	>
		<rect width={VIEW} height={VIEW} fill={bg} />
		{children}
	</svg>
);

/** Halftone dot pattern; use as fill={`url(#${id})`}. Place inside <defs>. */
export const Halftone: React.FC<{
	id: string;
	color?: string;
	spacing?: number;
	r?: number;
	angle?: number;
	opacity?: number;
}> = ({id, color = PAL.primary, spacing = 16, r = 3.2, angle = 30, opacity = 1}) => (
	<pattern
		id={id}
		width={spacing}
		height={spacing}
		patternUnits="userSpaceOnUse"
		patternTransform={`rotate(${angle})`}
	>
		<circle cx={spacing / 2} cy={spacing / 2} r={r} fill={color} opacity={opacity} />
	</pattern>
);

export type Wear = 'none' | 'hijab' | 'ghutra';
export type ArmPose = 'down' | 'point' | 'raise' | 'hold' | 'rest' | 'gesture' | 'none';

/** Key points of a figure, for placing props (badges, documents, pointers). */
export const personAnchors = (x: number, y: number, s = 1) => {
	const r = 36 * s;
	const W = 156 * s;
	const T = 176 * s;
	const top = y - T;
	const head = {x, y: top - 8 * s - r};
	return {
		r,
		W,
		T,
		top,
		head,
		neck: {x, y: top},
		chest: {x, y: top + 70 * s},
		shoulderL: {x: x - W / 2 + 16 * s, y: top + 30 * s},
		shoulderR: {x: x + W / 2 - 16 * s, y: top + 30 * s},
	};
};

const armPoints = (pose: ArmPose, side: 1 | -1, x: number, top: number, W: number, s: number) => {
	const ox = x + side * (W / 2);
	const P = (dx: number, dy: number) => ({x: ox + side * dx * s, y: top + dy * s});
	const H = (dx: number, dy: number) => ({x: x + side * dx * s, y: top + dy * s});
	switch (pose) {
		case 'down':
			return [P(4, 100), P(0, 168)];
		case 'point':
			return [P(58, 70), P(128, 18)];
		case 'raise':
			return [P(40, -20), P(30, -110)];
		case 'hold':
			return [P(6, 112), H(30, 120)];
		case 'rest':
			return [P(-6, 130), H(22, 150)];
		case 'gesture':
			return [P(40, 96), P(70, 40)];
		case 'none':
			return null;
	}
};

/**
 * Abstract, faceless figure. (x, y) is the center of the waist line; the bust
 * extends upward. `back` draws the figure from behind (audiences, trainees).
 */
export const Person: React.FC<{
	x: number;
	y: number;
	s?: number;
	body?: string;
	coat?: boolean;
	wear?: Wear;
	wearColor?: string;
	armL?: ArmPose;
	armR?: ArmPose;
	legs?: boolean;
	back?: boolean;
}> = ({
	x,
	y,
	s = 1,
	body = PAL.primary,
	coat = false,
	wear = 'none',
	wearColor,
	armL = 'down',
	armR = 'down',
	legs = false,
	back = false,
}) => {
	const a = personAnchors(x, y, s);
	const {r, W, top, head} = a;
	const torso = `M ${x - W / 2} ${y} L ${x - W / 2} ${top + 52 * s} C ${x - W / 2} ${top + 12 * s} ${x - W / 2 + 22 * s} ${top} ${x - W / 2 + 52 * s} ${top} L ${x + W / 2 - 52 * s} ${top} C ${x + W / 2 - 22 * s} ${top} ${x + W / 2} ${top + 12 * s} ${x + W / 2} ${top + 52 * s} L ${x + W / 2} ${y} Z`;
	const sleeve = coat ? PAL.white : body;
	const arm = (pose: ArmPose, side: 1 | -1) => {
		const pts = armPoints(pose, side, x, top, W, s);
		if (!pts) return null;
		const sh = side === 1 ? a.shoulderR : a.shoulderL;
		const d = `M ${sh.x} ${sh.y} L ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
		return (
			<g>
				{coat ? (
					<path d={d} stroke={PAL.light} strokeWidth={40 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				) : null}
				<path d={d} stroke={sleeve} strokeWidth={34 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<circle cx={pts[1].x} cy={pts[1].y} r={17 * s} fill={PAL.skin} />
			</g>
		);
	};
	const wc = wearColor ?? (wear === 'ghutra' ? PAL.white : PAL.deep);
	return (
		<g>
			{legs ? (
				<g fill={PAL.ink}>
					<rect x={x - 58 * s} y={y - 10 * s} width={48 * s} height={200 * s} rx={22 * s} />
					<rect x={x + 10 * s} y={y - 10 * s} width={48 * s} height={200 * s} rx={22 * s} />
				</g>
			) : null}
			{/* hijab drape sits behind the shoulders */}
			{wear === 'hijab' ? (
				<path
					d={`M ${head.x - r * 1.3} ${head.y + 4 * s} L ${x - W * 0.36} ${top + 50 * s} L ${x + W * 0.36} ${top + 50 * s} L ${head.x + r * 1.3} ${head.y + 4 * s} Z`}
					fill={wc}
				/>
			) : null}
			{wear === 'ghutra' && !back ? (
				<rect x={head.x - r * 0.66} y={head.y + r * 0.7} width={r * 1.32} height={top - head.y - r * 0.7 + 12 * s} fill={wc} />
			) : null}
			<rect x={x - 13 * s} y={head.y + r - 8 * s} width={26 * s} height={top - head.y - r + 14 * s} fill={PAL.skin} />
			<path d={torso} fill={coat ? PAL.white : body} stroke={coat ? PAL.light : 'none'} strokeWidth={3 * s} />
			{coat && !back ? (
				<g>
					<path d={`M ${x - 30 * s} ${top} L ${x + 30 * s} ${top} L ${x} ${top + 88 * s} Z`} fill={body} />
					<path
						d={`M ${x - 31 * s} ${top + 2 * s} L ${x - 6 * s} ${top + 100 * s} M ${x + 31 * s} ${top + 2 * s} L ${x + 6 * s} ${top + 100 * s} M ${x} ${top + 96 * s} L ${x} ${y}`}
						stroke={PAL.light}
						strokeWidth={4 * s}
						fill="none"
						strokeLinecap="round"
					/>
					<rect x={x - W / 2 + 24 * s} y={top + 112 * s} width={36 * s} height={6 * s} rx={3 * s} fill={PAL.light} />
				</g>
			) : null}
			{!coat && !back ? (
				<path d={`M ${x - 20 * s} ${top} L ${x + 20 * s} ${top} L ${x} ${top + 30 * s} Z`} fill={PAL.skin} />
			) : null}
			{wear === 'hijab' ? (
				<g>
					<circle cx={head.x} cy={head.y + 2 * s} r={r * 1.3} fill={wc} />
					{!back ? <ellipse cx={head.x} cy={head.y + 7 * s} rx={r * 0.74} ry={r * 0.86} fill={PAL.skin} /> : null}
				</g>
			) : null}
			{wear === 'ghutra' ? (
				<g>
					{back ? (
						<path
							d={`M ${head.x - r * 1.12} ${head.y + r * 0.1} A ${r * 1.12} ${r * 1.12} 0 0 1 ${head.x + r * 1.12} ${head.y + r * 0.1} L ${head.x + r * 1.3} ${top + 50 * s} Q ${head.x} ${top + 120 * s} ${head.x - r * 1.3} ${top + 50 * s} Z`}
							fill={wc}
							stroke={PAL.light}
							strokeWidth={3 * s}
						/>
					) : (
						<path
							d={`M ${head.x - r * 1.14} ${head.y + r * 0.15} A ${r * 1.14} ${r * 1.14} 0 0 1 ${head.x + r * 1.14} ${head.y + r * 0.15} L ${head.x + r * 1.22} ${head.y + r * 1.1} L ${head.x + r * 1.75} ${top + 54 * s} L ${head.x + r * 0.95} ${top + 70 * s} L ${head.x + r * 0.62} ${head.y + r * 0.9} L ${head.x - r * 0.62} ${head.y + r * 0.9} L ${head.x - r * 0.95} ${top + 70 * s} L ${head.x - r * 1.75} ${top + 54 * s} L ${head.x - r * 1.22} ${head.y + r * 1.1} Z`}
							fill={wc}
							stroke={PAL.light}
							strokeWidth={3 * s}
							strokeLinejoin="round"
						/>
					)}
					{!back ? <ellipse cx={head.x} cy={head.y + r * 0.22} rx={r * 0.66} ry={r * 0.8} fill={PAL.skin} /> : null}
					<path
						d={`M ${head.x - r * 1.06} ${head.y - r * 0.42} Q ${head.x} ${head.y - r * (back ? 0.12 : 0.62)} ${head.x + r * 1.06} ${head.y - r * 0.42}`}
						fill="none"
						stroke={PAL.ink}
						strokeWidth={6 * s}
						strokeLinecap="round"
					/>
					<path
						d={`M ${head.x - r * 1.08} ${head.y - r * 0.22} Q ${head.x} ${head.y + r * (back ? 0.08 : -0.42)} ${head.x + r * 1.08} ${head.y - r * 0.22}`}
						fill="none"
						stroke={PAL.ink}
						strokeWidth={5 * s}
						strokeLinecap="round"
					/>
				</g>
			) : null}
			{wear === 'none' ? (
				<g>
					<circle cx={head.x} cy={head.y} r={r} fill={PAL.skin} />
					<path
						d={
							back
								? `M ${head.x - r * 0.97} ${head.y + r * 0.3} A ${r * 1.02} ${r * 1.02} 0 1 1 ${head.x + r * 0.97} ${head.y + r * 0.3} Z`
								: `M ${head.x - r * 1.02} ${head.y + r * 0.12} A ${r * 1.02} ${r * 1.02} 0 0 1 ${head.x + r * 1.02} ${head.y + r * 0.12} Q ${head.x + r * 0.62} ${head.y - r * 0.42} ${head.x} ${head.y - r * 0.48} Q ${head.x - r * 0.62} ${head.y - r * 0.42} ${head.x - r * 1.02} ${head.y + r * 0.12} Z`
						}
						fill={wearColor ?? PAL.ink}
					/>
				</g>
			) : null}
			{arm(armL, -1)}
			{arm(armR, 1)}
		</g>
	);
};

/** Lanyard + ID card hung from a figure's neck (use personAnchors). */
export const Badge: React.FC<{x: number; neckY: number; s?: number}> = ({x, neckY, s = 1}) => (
	<g>
		<path
			d={`M ${x - 22 * s} ${neckY + 2 * s} L ${x} ${neckY + 92 * s} L ${x + 22 * s} ${neckY + 2 * s}`}
			stroke={PAL.primary}
			strokeWidth={5 * s}
			fill="none"
		/>
		<rect x={x - 22 * s} y={neckY + 88 * s} width={44 * s} height={58 * s} rx={5 * s} fill={PAL.white} stroke={PAL.ink} strokeWidth={2.5 * s} />
		<rect x={x - 14 * s} y={neckY + 98 * s} width={28 * s} height={12 * s} rx={2 * s} fill={PAL.primary} />
		<rect x={x - 14 * s} y={neckY + 118 * s} width={28 * s} height={4 * s} fill={PAL.light} />
		<rect x={x - 14 * s} y={neckY + 128 * s} width={20 * s} height={4 * s} fill={PAL.light} />
	</g>
);

/** Screen / whiteboard. Draw its content as children in absolute coords. */
export const Board: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	fill?: string;
	stand?: boolean;
	children?: React.ReactNode;
}> = ({x, y, w, h, fill = PAL.white, stand = false, children}) => (
	<g>
		{stand ? (
			<path d={`M ${x + w * 0.3} ${y + h} L ${x + w * 0.22} ${y + h + 160} M ${x + w * 0.7} ${y + h} L ${x + w * 0.78} ${y + h + 160}`} stroke={PAL.ink} strokeWidth={8} strokeLinecap="round" />
		) : null}
		<rect x={x} y={y} width={w} height={h} rx={10} fill={fill} stroke={PAL.ink} strokeWidth={4} />
		{children}
	</g>
);

/** A sheet of paper with text lines; `mark` highlights one line in primary. */
export const Doc: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	rotate?: number;
	lines?: number;
	mark?: number;
	heading?: boolean;
}> = ({x, y, w, h, rotate = 0, lines = 6, mark, heading = true}) => {
	const pad = w * 0.12;
	const gap = (h - pad * 2 - (heading ? 40 : 0)) / Math.max(1, lines);
	return (
		<g transform={`rotate(${rotate} ${x + w / 2} ${y + h / 2})`}>
			<rect x={x + 6} y={y + 8} width={w} height={h} rx={6} fill={PAL.ink} opacity={0.08} />
			<rect x={x} y={y} width={w} height={h} rx={6} fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} />
			{heading ? <rect x={x + w - pad - w * 0.45} y={y + pad} width={w * 0.45} height={14} rx={4} fill={PAL.deep} /> : null}
			{Array.from({length: lines}).map((_, i) => {
				const lw = (w - pad * 2) * (i % 3 === 2 ? 0.62 : 1);
				const ly = y + pad + (heading ? 40 : 0) + i * gap;
				return (
					<g key={i}>
						{mark === i ? <rect x={x + w - pad - lw - 6} y={ly - 9} width={lw + 12} height={22} rx={3} fill={PAL.pale} /> : null}
						<rect x={x + w - pad - lw} y={ly} width={lw} height={6} rx={3} fill={mark === i ? PAL.primary : PAL.light} />
					</g>
				);
			})}
		</g>
	);
};

/** Simple bar chart inside a frame. values are 0–1. */
export const Chart: React.FC<{x: number; y: number; w: number; h: number; values: number[]; accent?: number}> = ({
	x,
	y,
	w,
	h,
	values,
	accent,
}) => {
	const bw = (w * 0.7) / values.length;
	const gap = (w * 0.3) / (values.length + 1);
	return (
		<g>
			<line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={PAL.ink} strokeWidth={3} />
			{values.map((v, i) => (
				<rect
					key={i}
					x={x + gap + i * (bw + gap)}
					y={y + h - v * h}
					width={bw}
					height={v * h}
					rx={4}
					fill={i === accent ? PAL.primary : PAL.light}
				/>
			))}
		</g>
	);
};

/** A table seen slightly from above. */
export const Table: React.FC<{x: number; y: number; w: number; depth?: number; color?: string}> = ({
	x,
	y,
	w,
	depth = 90,
	color = PAL.white,
}) => (
	<g>
		<path d={`M ${x + 40} ${y} L ${x + w - 40} ${y} L ${x + w} ${y + depth} L ${x} ${y + depth} Z`} fill={color} stroke={PAL.ink} strokeWidth={3} />
		<rect x={x} y={y + depth} width={w} height={16} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
	</g>
);

/** Speech/discussion bubble with abstract text lines. */
export const Bubble: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	tail?: 'left' | 'right';
	fill?: string;
	lineColor?: string;
}> = ({x, y, w, h, tail = 'left', fill = PAL.white, lineColor = PAL.light}) => {
	const tx = tail === 'left' ? x + w * 0.22 : x + w * 0.78;
	return (
		<g>
			<path d={`M ${tx - 18} ${y + h - 2} L ${tx + (tail === 'left' ? -26 : 26)} ${y + h + 34} L ${tx + 18} ${y + h - 2} Z`} fill={fill} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			<rect x={x} y={y} width={w} height={h} rx={h * 0.3} fill={fill} stroke={PAL.ink} strokeWidth={3} />
			<rect x={tx - 16} y={y + h - 8} width={32} height={10} fill={fill} />
			<rect x={x + w * 0.18} y={y + h * 0.34} width={w * 0.64} height={8} rx={4} fill={lineColor} />
			<rect x={x + w * 0.32} y={y + h * 0.58} width={w * 0.5} height={8} rx={4} fill={lineColor} />
		</g>
	);
};
