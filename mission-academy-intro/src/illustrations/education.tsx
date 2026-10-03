// "التعليم والتدريب" — a bright lecture room seen from a raised 3/4 angle
// (back-right corner). Three rows of desks recede toward the front wall,
// where a presenter stands small beside the slide. Learners are seen from
// behind, two in profile (one writing at the aisle end, one turned to a
// neighbour). Window light from the side wall falls across the rows.
import {Board, Frame, Halftone, Person, PAL, personAnchors, useAmbientFrame, useIds} from './kit';
import type {Wear} from './kit';

type Pt = readonly [number, number];

/** A darker edge for a sleeve, so an arm reads against a same-colour torso. */
const edgeOf = (c: string) => (c === PAL.primary ? PAL.deep : c === PAL.deep ? PAL.ink : c === PAL.mid ? PAL.primary : PAL.light);

/** Arm in the kit's style through custom joints (shoulder → elbow → hand). */
const Limb: React.FC<{pts: Pt[]; s: number; color: string; edge: string; hand?: boolean}> = ({pts, s, color, edge, hand = true}) => {
	const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
	const [hx, hy] = pts[pts.length - 1];
	return (
		<g>
			<path d={d} stroke={edge} strokeWidth={39 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} stroke={color} strokeWidth={34 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			{hand ? <circle cx={hx} cy={hy} r={17 * s} fill={PAL.skin} /> : null}
		</g>
	);
};

type SideArm = 'desk' | 'gesture' | 'hold' | 'down' | 'reach' | 'none';

/** Joints (shoulder, elbow, hand) of a profile figure's near arm. */
const sideArm = (x: number, y: number, s: number, f: 1 | -1, pose: SideArm): Pt[] => {
	const top = y - 176 * s;
	const J = (dx: number, dy: number): Pt => [x + f * dx * s, top + dy * s];
	const sh = J(-6, 34);
	switch (pose) {
		case 'desk':
			return [sh, J(16, 116), J(102, 104)];
		case 'gesture':
			return [sh, J(30, 112), J(92, 50)];
		case 'hold':
			return [sh, J(18, 116), J(82, 84)];
		case 'down':
			return [sh, J(4, 100), J(8, 166)];
		case 'reach':
			return [sh, J(70, -20), J(120, -96)];
		case 'none':
			return [];
	}
};

/**
 * A figure in profile, drawn in the kit's geometry (same head size, torso
 * height and limb weight as <Person>). dir = -1 faces left; (x, y) is the
 * centre of the waist line. `part` splits a seated figure so a table can
 * pass between its legs ('legs') and its upper body ('upper').
 */
const Side: React.FC<{
	x: number;
	y: number;
	s?: number;
	dir?: 1 | -1;
	body?: string;
	coat?: boolean;
	wear?: Wear;
	wearColor?: string;
	arm?: SideArm;
	rot?: number;
	seated?: boolean;
	standing?: boolean;
	part?: 'all' | 'legs' | 'upper';
	/** Custom joints for the near arm (overrides `arm`). */
	pts?: Pt[];
}> = ({x, y, s = 1, dir = -1, body = PAL.primary, coat = false, wear = 'none', wearColor, arm = 'desk', rot = 0, seated = false, standing = false, part = 'all', pts: custom}) => {
	const f = dir;
	const top = y - 176 * s;
	const r = 36 * s;
	const hx = x + f * 14 * s;
	const hy = top - 8 * s - r;
	const half = 50 * s;
	const bx = x - f * half;
	const fx = x + f * half;
	const P = (deg: number, k = 1): Pt => [hx + f * r * k * Math.cos((deg * Math.PI) / 180), hy - r * k * Math.sin((deg * Math.PI) / 180)];
	const sweep = f === 1 ? 0 : 1;
	const torso = `M ${bx} ${y} L ${bx} ${top + 62 * s} C ${bx} ${top + 16 * s} ${x - f * 26 * s} ${top} ${x} ${top} L ${x + f * 12 * s} ${top} C ${fx - f * 4 * s} ${top} ${fx} ${top + 22 * s} ${fx} ${top + 52 * s} L ${fx} ${y} Z`;
	const sleeve = coat ? PAL.white : body;
	const wc = wearColor ?? (wear === 'ghutra' ? PAL.white : PAL.deep);
	const [hairAx, hairAy] = P(62, 1.04);
	const [hairBx, hairBy] = P(218, 1.04);
	const [gFx, gFy] = P(30, 1.08);
	const [gBx, gBy] = P(190, 1.14);
	const pts = custom ?? sideArm(x, y, s, f, arm);
	const legs = part !== 'upper';
	const upper = part !== 'legs';
	return (
		<g>
			{legs && seated ? (
				<g>
					<g stroke={PAL.ink} strokeWidth={6 * s} strokeLinecap="round">
						<line x1={x - f * 40 * s} y1={y + 10 * s} x2={x - f * 44 * s} y2={y + 140 * s} />
						<line x1={x + f * 50 * s} y1={y + 10 * s} x2={x + f * 54 * s} y2={y + 140 * s} />
					</g>
					<path
						d={`M ${x - f * 8 * s} ${y - 16 * s} L ${x + f * 112 * s} ${y - 14 * s} L ${x + f * 118 * s} ${y + 140 * s}`}
						stroke={PAL.ink}
						strokeWidth={44 * s}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<rect x={x - 66 * s} y={y - 2 * s} width={132 * s} height={16 * s} rx={8 * s} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
				</g>
			) : null}
			{legs && standing ? (
				<g fill={PAL.ink}>
					<rect x={x - f * 6 * s - 24 * s} y={y - 10 * s} width={48 * s} height={200 * s} rx={22 * s} />
					<rect x={x + f * 14 * s - 24 * s} y={y - 10 * s} width={48 * s} height={200 * s} rx={22 * s} transform={`rotate(${-f * 6} ${x} ${y})`} />
				</g>
			) : null}
			{upper ? (
				<g transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
					{wear === 'hijab' ? (
						<path
							d={`M ${hx - f * r * 1.22} ${hy + r * 0.2} L ${bx + f * 4 * s} ${top + 58 * s} L ${x + f * 30 * s} ${top + 44 * s} L ${hx + f * r * 0.7} ${hy + r * 0.9} Z`}
							fill={wc}
						/>
					) : null}
					{wear === 'ghutra' ? (
						<path
							d={`M ${hx - f * r * 1.1} ${hy + r * 0.3} L ${bx - f * 2 * s} ${top + 70 * s} Q ${x - f * 6 * s} ${top + 40 * s} ${x + f * 18 * s} ${top + 30 * s} L ${hx + f * r * 0.62} ${hy + r * 0.9} Z`}
							fill={wc}
							stroke={PAL.light}
							strokeWidth={3 * s}
							strokeLinejoin="round"
						/>
					) : null}
					<rect x={hx - 13 * s - f * 4 * s} y={hy + r - 8 * s} width={26 * s} height={top - hy - r + 14 * s} fill={PAL.skin} />
					<path d={torso} fill={coat ? PAL.white : body} stroke={coat ? PAL.light : 'none'} strokeWidth={3 * s} />
					{coat ? (
						<g>
							<path d={`M ${x + f * 8 * s} ${top} L ${fx - f * 3 * s} ${top + 30 * s} L ${fx - f * 3 * s} ${top + 92 * s} Z`} fill={body} />
							<path
								d={`M ${x + f * 8 * s} ${top + 2 * s} L ${x + f * 30 * s} ${top + 104 * s} L ${x + f * 30 * s} ${y}`}
								stroke={PAL.light}
								strokeWidth={4 * s}
								fill="none"
								strokeLinecap="round"
							/>
						</g>
					) : null}
					{wear === 'hijab' ? (
						<g>
							<circle cx={hx - f * r * 0.1} cy={hy + 2 * s} r={r * 1.28} fill={wc} />
							<ellipse cx={hx + f * r * 0.42} cy={hy + r * 0.12} rx={r * 0.52} ry={r * 0.78} fill={PAL.skin} />
						</g>
					) : null}
					{wear === 'ghutra' ? (
						<g>
							<path
								d={`M ${gFx} ${gFy} A ${r * 1.1} ${r * 1.1} 0 0 ${sweep} ${gBx} ${gBy} L ${hx - f * r * 0.24} ${hy + r * 1.0} L ${hx + f * r * 0.22} ${hy + r * 0.96} L ${hx + f * r * 0.5} ${hy - r * 0.2} Z`}
								fill={wc}
								stroke={PAL.light}
								strokeWidth={3 * s}
								strokeLinejoin="round"
							/>
							<ellipse cx={hx + f * r * 0.62} cy={hy + r * 0.2} rx={r * 0.5} ry={r * 0.72} fill={PAL.skin} />
							<path
								d={`M ${hx + f * r * 0.9} ${hy - r * 0.46} Q ${hx - f * r * 0.1} ${hy - r * 0.66} ${hx - f * r * 1.08} ${hy - r * 0.3}`}
								fill="none"
								stroke={PAL.ink}
								strokeWidth={6 * s}
								strokeLinecap="round"
							/>
							<path
								d={`M ${hx + f * r * 0.94} ${hy - r * 0.24} Q ${hx - f * r * 0.1} ${hy - r * 0.42} ${hx - f * r * 1.1} ${hy - r * 0.08}`}
								fill="none"
								stroke={PAL.ink}
								strokeWidth={5 * s}
								strokeLinecap="round"
							/>
						</g>
					) : null}
					{wear === 'none' ? (
						<g>
							<circle cx={hx} cy={hy} r={r} fill={PAL.skin} />
							<path
								d={`M ${hairAx} ${hairAy} A ${r * 1.04} ${r * 1.04} 0 0 ${sweep} ${hairBx} ${hairBy} L ${hx - f * r * 0.12} ${hy + r * 0.2} Q ${hx + f * r * 0.1} ${hy - r * 0.5} ${hairAx} ${hairAy} Z`}
								fill={wearColor ?? PAL.ink}
							/>
						</g>
					) : null}
					{pts.length ? <Limb pts={pts} s={s} color={sleeve} edge={coat ? PAL.light : edgeOf(body)} /> : null}
				</g>
			) : null}
			{upper && seated ? (
				<rect x={x - f * 66 * s - 9 * s} y={y - 118 * s} width={18 * s} height={132 * s} rx={9 * s} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
			) : null}
		</g>
	);
};

/** Short hair seen from behind: covers the whole head so it never reads as a face. */
const BackHair: React.FC<{x: number; y: number; s: number; color?: string}> = ({x, y, s, color = PAL.ink}) => {
	const {head, r} = personAnchors(x, y, s);
	return <circle cx={head.x} cy={head.y - r * 0.04} r={r * 1.02} fill={color} />;
};

// One-point perspective: horizontal lines that run front-to-back converge on
// VP (left of centre, high: the camera looks down from the back-right corner).
const VP = {x: 430, y: 110};
/** Move a floor/desk point at (x, y) straight back in depth to screen y2. */
const back = (x: number, y: number, y2: number): Pt => [VP.x + ((x - VP.x) * (y2 - VP.y)) / (y - VP.y), y2];

/** Rows: waist line y and figure scale s. Desks span u0..u1 (row-3 units). */
type Row = {y: number; s: number};
const Y3 = 1160;
const ROWS: Row[] = [
	{y: 598, s: 0.5},
	{y: 836, s: 0.75},
	{y: Y3, s: 1.08},
];
/** Screen x of column u (defined at the nearest row) on a row's waist line. */
const col = (u: number, y: number) => VP.x + ((u - VP.x) * (y - VP.y)) / (Y3 - VP.y);
const edges = (r: Row) => ({yN: r.y - 92 * r.s, yF: r.y - 214 * r.s});

/** A long desk seen from above and behind; its right end faces the aisle. */
const Desk: React.FC<{row: Row; u0: number; u1: number}> = ({row, u0, u1}) => {
	const {yN, yF} = edges(row);
	const s = row.s;
	const th = 18 * s;
	const x0 = col(u0, yN);
	const x1 = col(u1, yN);
	const [fx0] = back(x0, yN, yF);
	const [fx1] = back(x1, yN, yF);
	const k = (yF - VP.y) / (yN - VP.y);
	return (
		<g>
			<g stroke={PAL.ink} strokeWidth={7 * s} strokeLinecap="round">
				<line x1={x1 - 16 * s} y1={yN + th} x2={x1 - 16 * s} y2={yN + th + 150 * s} />
				<line x1={fx1 - 12 * s} y1={yF + th * k} x2={fx1 - 12 * s} y2={yF + th * k + 140 * s} />
			</g>
			<path
				d={`M ${x1} ${yN} L ${fx1} ${yF} L ${fx1} ${yF + th * k} L ${x1} ${yN + th} Z`}
				fill={PAL.light}
				stroke={PAL.ink}
				strokeWidth={3}
				strokeLinejoin="round"
			/>
			<path d={`M ${x0} ${yN} L ${x1} ${yN} L ${fx1} ${yF} L ${fx0} ${yF} Z`} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			<rect x={x0} y={yN} width={x1 - x0} height={th} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
		</g>
	);
};

/** The back of an open laptop lid standing on a desk; (x, y) = hinge centre. */
const Lid: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<g>
		<path
			d={`M ${x - 54 * s} ${y} L ${x + 54 * s} ${y} L ${x + 50 * s} ${y - 74 * s} L ${x - 58 * s} ${y - 74 * s} Z`}
			fill={PAL.light}
			stroke={PAL.ink}
			strokeWidth={3}
			strokeLinejoin="round"
		/>
		<rect x={x - 44 * s} y={y - 13 * s} width={88 * s} height={5 * s} rx={2.5 * s} fill={PAL.pale} />
	</g>
);

/** A notebook lying flat on a desk, in the room's perspective. */
const Pad: React.FC<{x: number; y: number; w: number; h: number; mark?: boolean}> = ({x, y, w, h, mark}) => {
	const c: Pt[] = [[x - w / 2, y], [x + w / 2, y], back(x + w / 2, y, y - h), back(x - w / 2, y, y - h)];
	const at = (fx: number, fy: number): Pt => {
		const [lx] = back(x - w / 2, y, y - h * fy);
		const [rx] = back(x + w / 2, y, y - h * fy);
		return [lx + (rx - lx) * fx, y - h * fy];
	};
	return (
		<g>
			<path d={`M ${c.map((p) => p.join(' ')).join(' L ')} Z`} fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			{[0.28, 0.5, 0.72].map((fy, i) => {
				const a = at(0.16, fy);
				const b = at(i === 1 ? 0.6 : 0.84, fy);
				return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={mark && i === 2 ? PAL.primary : PAL.light} strokeWidth={5} strokeLinecap="round" />;
			})}
		</g>
	);
};

/** Chair back seen from behind, in front of a seated learner's waist. */
const ChairBack: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<g>
		<g stroke={PAL.ink} strokeWidth={6 * s} strokeLinecap="round">
			<line x1={x - 40 * s} y1={y} x2={x - 46 * s} y2={y + 120 * s} />
			<line x1={x + 40 * s} y1={y} x2={x + 46 * s} y2={y + 120 * s} />
		</g>
		<rect x={x - 58 * s} y={y - 58 * s} width={116 * s} height={64 * s} rx={20 * s} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
	</g>
);

type Learner = {u: number; wear: Wear; body: string; wearColor?: string; lap?: number; lean?: number};

const LEARNERS: Learner[][] = [
	[
		{u: -260, wear: 'hijab', body: PAL.mid, wearColor: PAL.ink, lap: 0},
		{u: 40, wear: 'ghutra', body: PAL.deep, lap: 0},
		{u: 340, wear: 'none', body: PAL.primary, lap: 0, lean: -3},
		{u: 640, wear: 'hijab', body: PAL.deep, wearColor: PAL.mid, lap: 0},
		{u: 940, wear: 'ghutra', body: PAL.primary, lap: 0},
		{u: 1240, wear: 'hijab', body: PAL.primary, wearColor: PAL.deep, lap: 0},
	],
	[
		{u: 40, wear: 'none', body: PAL.deep, lap: -30},
		{u: 340, wear: 'hijab', body: PAL.primary, wearColor: PAL.deep, lap: 30, lean: 3},
		{u: 640, wear: 'ghutra', body: PAL.mid, lap: -30},
		{u: 940, wear: 'hijab', body: PAL.deep, wearColor: PAL.ink, lap: 30, lean: 4},
	],
	[
		{u: 30, wear: 'hijab', body: PAL.primary, wearColor: PAL.ink, lap: 50},
		{u: 360, wear: 'ghutra', body: PAL.deep, lap: -60},
		{u: 690, wear: 'hijab', body: PAL.mid, wearColor: PAL.deep, lap: 50},
	],
];
const DESKS: [number, number][] = [
	[-400, 1430],
	[-400, 1410],
	[-400, 1420],
];

export const focus = {
	center: [0.5, 0.52],
	/** The middle row of learners at their laptops. */
	learners: [0.44, 0.58],
	/** The presenter beside the slide at the front of the room. */
	presenter: [0.6, 0.25],
} as const;

const Education: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep', 'sun', 'wall');
	const t = useAmbientFrame();
	const nod = Math.sin(t / 40) * 1.2;
	const talk = Math.sin(t / 30 + 1) * 1.4;

	// Window panes on the side wall; their horizontals run to VP.
	const pane = (x0: number, x1: number, top0: number, bot0: number) => {
		const top1 = VP.y + ((top0 - VP.y) * (x1 - VP.x)) / (x0 - VP.x);
		const bot1 = VP.y + ((bot0 - VP.y) * (x1 - VP.x)) / (x0 - VP.x);
		return {x0, x1, top0, top1, bot0, bot1};
	};
	const panes = [pane(1018, 1084, 64, 384), pane(1112, 1186, 50, 432)];
	// Sunlight: each pane's patch on the floor, cast down-left from the wall base.
	const sun = (p: (typeof panes)[number]) => {
		const floor = (x: number) => 428 + (x - 990) * 0.562;
		const v = [-430, 262];
		const a: Pt = [p.x0, floor(p.x0)];
		const b: Pt = [p.x1, floor(p.x1)];
		return `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${b[0] + v[0]} ${b[1] + v[1]} L ${a[0] + v[0]} ${a[1] + v[1]} Z`;
	};

	return (
		<Frame bg={PAL.pale}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={12} r={2.4} opacity={0.5} />
				<Halftone id={ids.sun} color={PAL.white} spacing={16} r={3.6} angle={20} />
				<clipPath id={ids.wall}>
					<rect x={0} y={0} width={990} height={428} />
				</clipPath>
			</defs>

			{/* room: front wall, side wall with windows, floor */}
			<path d="M 0 0 L 990 0 L 990 428 L 0 428 Z" fill={PAL.mist} />
			<circle cx={470} cy={300} r={300} fill={`url(#${ids.dots})`} clipPath={`url(#${ids.wall})`} />
			<path d="M 990 0 L 1200 0 L 1200 546 L 990 428 Z" fill={PAL.white} />
			<path d="M 990 428 L 1200 546" stroke={PAL.light} strokeWidth={4} />
			<line x1={990} y1={0} x2={990} y2={428} stroke={PAL.light} strokeWidth={4} />
			<line x1={0} y1={428} x2={990} y2={428} stroke={PAL.light} strokeWidth={4} />
			<g>
				<rect x={70} y={196} width={110} height={232} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
				<rect x={84} y={210} width={82} height={86} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
				<rect x={150} y={318} width={8} height={30} rx={4} fill={PAL.ink} />
			</g>
			{panes.map((p, i) => (
				<g key={i}>
					<path d={`M ${p.x0} ${p.top0} L ${p.x1} ${p.top1} L ${p.x1} ${p.bot1} L ${p.x0} ${p.bot0} Z`} fill={PAL.mist} stroke={PAL.ink} strokeWidth={4} strokeLinejoin="round" />
					<path
						d={`M ${p.x0 + 10} ${p.top0 + 10} L ${p.x1 - 10} ${p.top1 + 10} L ${p.x1 - 10} ${p.top1 + 130} L ${p.x0 + 10} ${p.top0 + 130} Z`}
						fill={`url(#${ids.sun})`}
					/>
					<line x1={p.x0} y1={(p.top0 + p.bot0) / 2} x2={p.x1} y2={(p.top1 + p.bot1) / 2} stroke={PAL.ink} strokeWidth={4} />
					<line x1={(p.x0 + p.x1) / 2} y1={(p.top0 + p.top1) / 2} x2={(p.x0 + p.x1) / 2} y2={(p.bot0 + p.bot1) / 2} stroke={PAL.ink} strokeWidth={3} />
				</g>
			))}

			{/* slide on the front wall + presenter */}
			<Board x={276} y={222} w={380} h={180}>
				<rect x={302} y={246} width={152} height={130} rx={6} fill={PAL.pale} />
				<rect x={302} y={246} width={152} height={130} rx={6} fill={`url(#${ids.dotsDeep})`} />
				<circle cx={378} cy={311} r={36} fill={PAL.primary} />
				<rect x={478} y={254} width={130} height={14} rx={5} fill={PAL.deep} />
				<rect x={478} y={290} width={150} height={8} rx={4} fill={PAL.light} />
				<rect x={478} y={310} width={122} height={8} rx={4} fill={PAL.light} />
				<rect x={478} y={330} width={138} height={8} rx={4} fill={PAL.light} />
				<rect x={478} y={350} width={92} height={8} rx={4} fill={PAL.primary} />
			</Board>
			<Person x={744} y={360} s={0.4} body={PAL.deep} wear="ghutra" armL="point" armR="down" legs />

			{/* window light falling across the floor */}
			{panes.map((p, i) => (
				<g key={i}>
					<path d={sun(p)} fill={PAL.white} opacity={0.55} />
					<path d={sun(p)} fill={`url(#${ids.sun})`} />
				</g>
			))}

			{ROWS.map((row, ri) => {
				const {yN, yF} = edges(row);
				const hinge = yN - (yN - yF) * 0.5;
				return (
					<g key={ri}>
						<Desk row={row} u0={DESKS[ri][0]} u1={DESKS[ri][1]} />
						{LEARNERS[ri].map((l, i) => (
							<Lid key={i} x={col(l.u, hinge) + (l.lap ?? 0) * row.s} y={hinge} s={row.s} />
						))}
						{ri === 1 ? (
							<g>
								<Pad x={col(1240, yN) - 70 * row.s} y={yN - 14} w={74} h={50} mark />
							</g>
						) : null}
						{ri === 2 ? (
							<g>
								<Pad x={col(200, yN)} y={yN - 30} w={110} h={70} mark />
								<Pad x={col(980, yN) - 120} y={yN - 36} w={104} h={66} />
							</g>
						) : null}
						{LEARNERS[ri].map((l, i) => (
							<g key={i}>
								<g transform={l.lean ? `rotate(${l.lean} ${col(l.u, row.y)} ${row.y})` : undefined}>
								<Person x={col(l.u, row.y)} y={row.y} s={row.s} back body={l.body} wear={l.wear} wearColor={l.wearColor} armL="none" armR="none" />
									{l.wear === 'none' ? <BackHair x={col(l.u, row.y)} y={row.y} s={row.s} /> : null}
								</g>
								<ChairBack x={col(l.u, row.y)} y={row.y + 8 * row.s} s={row.s} />
							</g>
						))}
						{ri === 1 ? (
							<Side x={col(1240, row.y)} y={row.y - 6} s={row.s} dir={-1} body={PAL.primary} coat wear="none" arm="gesture" rot={talk} seated />
						) : null}
						{ri === 2 ? (
							<Side x={col(1000, row.y)} y={row.y} s={row.s} dir={-1} body={PAL.deep} coat wear="hijab" wearColor={PAL.ink} arm="desk" rot={nod} seated />
						) : null}
					</g>
				);
			})}

		</Frame>
	);
};

export default Education;
