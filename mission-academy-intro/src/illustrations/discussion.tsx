// "نقاش" — a round-table discussion seen slightly from above. Two colleagues
// across the table (a clinician in hijab and coat, a colleague in ghutra who
// is talking, hand raised mid-point), a third in profile leaning in from the
// table's end, and a fourth in the foreground from behind. Papers, a tablet
// and cups on the table; two speech bubbles — the speaker's in primary.
import {Bubble, Doc, Frame, Halftone, Person, PAL, personAnchors, useAmbientFrame, useIds} from './kit';
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

// Table: a round top seen slightly from above.
const T = {cx: 600, cy: 742, rx: 340, ry: 116, th: 22};
const tableY = (x: number, side: 1 | -1) => T.cy + side * T.ry * Math.sqrt(Math.max(0, 1 - ((x - T.cx) / T.rx) ** 2));

const A = {x: 466, y: 706, s: 0.92}; // far left: clinician, hijab + coat
const B = {x: 744, y: 706, s: 0.92}; // far right: ghutra — the one talking
const C = {x: 214, y: 806, s: 1}; // left end, in profile
const D = {x: 884, y: 1150, s: 1.3}; // foreground, from behind (seated, near side)

const BUB_B = {x: 700, y: 262, w: 300, h: 132};
const BUB_C = {x: 188, y: 318, w: 244, h: 108};

export const focus = {
	center: [0.5, 0.5],
	/** The table top with the shared papers. */
	table: [0.5, 0.615],
	/** The person currently talking (far right, gesturing) and their bubble. */
	speaker: [0.63, 0.43],
	/** The speech bubbles. */
	bubbles: [0.47, 0.28],
} as const;

/** A sheet lying on the table: drawn flat, then squashed into the table's perspective. */
const FlatDoc: React.FC<{cx: number; cy: number; w: number; h: number; rot: number; mark?: number; lines?: number}> = ({cx, cy, w, h, rot, mark, lines = 3}) => (
	<g transform={`translate(${cx} ${cy}) scale(1 0.42) rotate(${rot}) translate(${-cx} ${-cy})`}>
		<Doc x={cx - w / 2} y={cy - h / 2} w={w} h={h} lines={lines} mark={mark} heading={false} />
	</g>
);

/** A cup on the table. */
const Cup: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g>
		<ellipse cx={x} cy={y + 2} rx={26} ry={8} fill={PAL.ink} opacity={0.12} />
		<path d={`M ${x - 18} ${y - 36} L ${x + 18} ${y - 36} L ${x + 15} ${y - 2} Q ${x + 14} ${y + 4} ${x + 8} ${y + 4} L ${x - 8} ${y + 4} Q ${x - 14} ${y + 4} ${x - 15} ${y - 2} Z`} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
		<rect x={x - 16} y={y - 26} width={32} height={9} fill={PAL.deep} />
	</g>
);

const Discussion: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep');
	const t = useAmbientFrame();
	const bobB = Math.sin(t / 32) * 3;
	const bobC = Math.sin(t / 32 + 2.2) * 3;
	const wave = Math.sin(t / 26) * 1.5;
	const a = personAnchors(A.x, A.y, A.s);
	const b = personAnchors(B.x, B.y, B.s);

	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={12} r={2.4} opacity={0.5} />
			</defs>

			{/* room */}
			<circle cx={600} cy={560} r={420} fill={`url(#${ids.dots})`} />
			<rect x={0} y={880} width={1200} height={320} fill={PAL.pale} />

			{/* far side of the table: two colleagues facing us */}
			<Person x={A.x} y={A.y} s={A.s} coat body={PAL.primary} wear="hijab" wearColor={PAL.ink} armL="none" armR="none" />
			<g transform={`rotate(${wave} ${b.shoulderR.x} ${b.shoulderR.y})`}>
				<Person x={B.x} y={B.y} s={B.s} body={PAL.deep} wear="ghutra" armL="none" armR="gesture" />
			</g>

			{/* profile colleague's legs and chair go under the table's end */}
			<Side x={C.x} y={C.y} s={C.s} dir={1} body={PAL.mid} coat wear="none" arm="desk" seated part="legs" />

			{/* the table */}
			<g>
				<rect x={T.cx - 20} y={T.cy + 40} width={40} height={250} fill={PAL.ink} />
				<ellipse cx={T.cx} cy={T.cy + 290} rx={110} ry={22} fill={PAL.ink} />
				<ellipse cx={T.cx} cy={T.cy + T.th} rx={T.rx} ry={T.ry} fill={PAL.light} stroke={PAL.ink} strokeWidth={4} />
				<ellipse cx={T.cx} cy={T.cy} rx={T.rx} ry={T.ry} fill={PAL.white} stroke={PAL.ink} strokeWidth={4} />
				<ellipse cx={T.cx} cy={T.cy} rx={T.rx * 0.5} ry={T.ry * 0.5} fill={`url(#${ids.dotsDeep})`} opacity={0.5} />
			</g>

			{/* papers, a tablet and cups on the table */}
			<FlatDoc cx={600} cy={748} w={190} h={230} rot={-6} mark={1} lines={4} />
			<FlatDoc cx={470} cy={690} w={140} h={170} rot={10} lines={3} />
			<FlatDoc cx={760} cy={694} w={140} h={170} rot={-12} mark={0} lines={3} />
			<g transform="translate(372 774) scale(1 0.42) rotate(18) translate(-372 -774)">
				<rect x={302} y={704} width={140} height={140} rx={14} fill={PAL.ink} />
				<rect x={314} y={716} width={116} height={116} rx={6} fill={PAL.pale} />
				<path d="M 330 800 L 360 770 L 384 784 L 414 742" stroke={PAL.primary} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			</g>
			<Cup x={872} y={758} />
			<Cup x={352} y={706} />

			{/* forearms resting on the table */}
			<Limb pts={[[a.shoulderL.x, a.shoulderL.y], [a.shoulderL.x - 8, a.top + 100], [A.x - 20, 676]]} s={A.s} color={PAL.white} edge={PAL.light} />
			<Limb pts={[[a.shoulderR.x, a.shoulderR.y], [a.shoulderR.x + 10, a.top + 100], [A.x + 34, 682]]} s={A.s} color={PAL.white} edge={PAL.light} />
			<Limb pts={[[b.shoulderL.x, b.shoulderL.y], [b.shoulderL.x - 6, b.top + 100], [B.x - 30, 680]]} s={B.s} color={PAL.deep} edge={PAL.ink} />

			{/* profile colleague, leaning in with a hand on the table */}
			<Side x={C.x} y={C.y} s={C.s} dir={1} body={PAL.mid} coat wear="none" arm="desk" seated part="upper" rot={2} />

			{/* foreground colleague, from behind */}
			<Person x={D.x} y={D.y} s={D.s} back body={PAL.primary} wear="hijab" wearColor={PAL.mid} armL="none" armR="none" />
			<g>
				<g stroke={PAL.ink} strokeWidth={8} strokeLinecap="round">
					<line x1={D.x - 56} y1={D.y + 10} x2={D.x - 64} y2={D.y + 160} />
					<line x1={D.x + 56} y1={D.y + 10} x2={D.x + 64} y2={D.y + 160} />
				</g>
				<rect x={D.x - 80} y={D.y - 90} width={160} height={100} rx={28} fill={PAL.light} stroke={PAL.ink} strokeWidth={4} />
			</g>

			{/* the conversation */}
			<g transform={`translate(0 ${bobC})`}>
				<Bubble x={BUB_C.x} y={BUB_C.y} w={BUB_C.w} h={BUB_C.h} tail="left" />
			</g>
			<g transform={`translate(0 ${bobB})`}>
				<Bubble x={BUB_B.x} y={BUB_B.y} w={BUB_B.w} h={BUB_B.h} tail="left" fill={PAL.primary} lineColor={PAL.light} />
			</g>
		</Frame>
	);
};

export default Discussion;
