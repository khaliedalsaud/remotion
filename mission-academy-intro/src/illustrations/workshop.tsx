// "ورشة عمل" — a workshop at a wall board. Cards and sticky notes are
// clustered in columns and linked by lines; a primary thread runs through
// them to an empty dashed slot, where a participant (from behind) is pressing
// a new primary card into place. A clinician in profile points to a card on
// the left; a third participant watches from the foreground.
import {Frame, Halftone, Person, PAL, personAnchors, useAmbientFrame, useIds} from './kit';
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

const BOARD = {x: 318, y: 226, w: 704, h: 486};
const P1 = {x: 700, y: 900, s: 1.1}; // placing the card (from behind)
const P2 = {x: 222, y: 884, s: 1.06}; // profile, pointing
const P3 = {x: 1016, y: 1236, s: 1.34}; // foreground, from behind

type Card = {x: number; y: number; w: number; h: number; fill: string; rot: number};
const CARDS: Card[] = [
	{x: 360, y: 292, w: 112, h: 78, fill: PAL.pale, rot: -2},
	{x: 366, y: 398, w: 104, h: 74, fill: PAL.white, rot: 1.5},
	{x: 358, y: 500, w: 110, h: 76, fill: PAL.pale, rot: -1},
	{x: 532, y: 286, w: 108, h: 76, fill: PAL.primary, rot: 2},
	{x: 540, y: 392, w: 100, h: 72, fill: PAL.pale, rot: -2},
	{x: 532, y: 494, w: 84, h: 84, fill: PAL.white, rot: 3},
	{x: 708, y: 296, w: 110, h: 78, fill: PAL.white, rot: -1.5},
	{x: 712, y: 404, w: 104, h: 74, fill: PAL.light, rot: 2},
	{x: 878, y: 290, w: 104, h: 76, fill: PAL.pale, rot: 1},
	{x: 872, y: 394, w: 108, h: 76, fill: PAL.primary, rot: -2},
	{x: 890, y: 500, w: 84, h: 84, fill: PAL.white, rot: -3},
];
/** The empty slot the new card goes into, and the card in hand. */
const SLOT = {x: 742, y: 516, w: 108, h: 76};
const NEW = {x: 754, y: 528, w: 108, h: 76};
const ctr = (c: {x: number; y: number; w: number; h: number}): Pt => [c.x + c.w / 2, c.y + c.h / 2];

export const focus = {
	center: [0.5, 0.5],
	/** The new card being pressed onto the board. */
	card: [0.673, 0.471],
	/** The board of cards and links. */
	board: [0.558, 0.39],
} as const;

const CardShape: React.FC<{c: Card; dots?: string}> = ({c, dots}) => {
	const dark = c.fill === PAL.primary;
	const line = dark ? PAL.white : c.fill === PAL.light ? PAL.white : PAL.light;
	return (
		<g transform={`rotate(${c.rot} ${c.x + c.w / 2} ${c.y + c.h / 2})`}>
			<rect x={c.x + 4} y={c.y + 6} width={c.w} height={c.h} rx={4} fill={PAL.ink} opacity={0.1} />
			<rect x={c.x} y={c.y} width={c.w} height={c.h} rx={4} fill={c.fill} stroke={PAL.ink} strokeWidth={3} />
			{dots ? <rect x={c.x + 3} y={c.y + c.h - 18} width={c.w - 6} height={15} fill={`url(#${dots})`} /> : null}
			<rect x={c.x + c.w * 0.16} y={c.y + c.h * 0.3} width={c.w * 0.64} height={7} rx={3.5} fill={line} />
			<rect x={c.x + c.w * 0.16} y={c.y + c.h * 0.3 + 16} width={c.w * 0.42} height={7} rx={3.5} fill={line} />
			<circle cx={c.x + c.w / 2} cy={c.y + 2} r={6} fill={PAL.ink} />
		</g>
	);
};

const Workshop: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep', 'dotsWhite');
	const t = useAmbientFrame();
	const press = Math.sin(t / 28) * 3;
	const point = Math.sin(t / 40 + 1) * 1.2;
	const p1 = personAnchors(P1.x, P1.y, P1.s);
	const c = (i: number) => ctr(CARDS[i]);
	const links: [Pt, Pt][] = [
		[c(0), c(3)],
		[c(1), c(4)],
		[c(3), c(6)],
		[c(4), c(7)],
		[c(6), c(8)],
		[c(2), c(5)],
		[c(9), c(10)],
	];
	const thread: Pt[] = [c(1), c(4), c(7), ctr(SLOT)];
	const curve = (p: Pt[]) =>
		p
			.map(([x, y], i) => {
				if (i === 0) return `M ${x} ${y}`;
				const [px, py] = p[i - 1];
				const mx = (px + x) / 2;
				return `C ${mx} ${py} ${mx} ${y} ${x} ${y}`;
			})
			.join(' ');
	const hand: Pt = [NEW.x + NEW.w * 0.5 + press * 0.4, NEW.y + NEW.h - 4 + press];

	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={12} r={2.4} opacity={0.5} />
				<Halftone id={ids.dotsWhite} color={PAL.white} spacing={10} r={2} opacity={0.6} />
			</defs>

			{/* room */}
			<circle cx={670} cy={470} r={450} fill={`url(#${ids.dots})`} />
			<rect x={0} y={1010} width={1200} height={190} fill={PAL.pale} />

			{/* the board */}
			<rect x={BOARD.x + 8} y={BOARD.y + 10} width={BOARD.w} height={BOARD.h} rx={10} fill={PAL.ink} opacity={0.1} />
			<rect x={BOARD.x} y={BOARD.y} width={BOARD.w} height={BOARD.h} rx={10} fill={PAL.white} stroke={PAL.ink} strokeWidth={4} />
			<rect x={BOARD.x + 18} y={BOARD.y + 18} width={BOARD.w - 36} height={BOARD.h - 36} rx={4} fill={PAL.paper} />
			<rect x={BOARD.x - 10} y={BOARD.y + BOARD.h - 4} width={BOARD.w + 20} height={16} rx={6} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
			<rect x={BOARD.x + 470} y={BOARD.y + BOARD.h - 14} width={60} height={12} rx={5} fill={PAL.primary} />
			<rect x={BOARD.x + 540} y={BOARD.y + BOARD.h - 14} width={60} height={12} rx={5} fill={PAL.deep} />

			{/* links between cards, and the primary thread to the empty slot */}
			{links.map(([[x1, y1], [x2, y2]], i) => (
				<path key={i} d={curve([[x1, y1], [x2, y2]])} stroke={PAL.ink} strokeWidth={3} fill="none" strokeDasharray={i % 3 === 2 ? '8 8' : undefined} />
			))}
			<path d={curve(thread)} stroke={PAL.primary} strokeWidth={9} fill="none" strokeLinecap="round" />
			<rect x={SLOT.x} y={SLOT.y} width={SLOT.w} height={SLOT.h} rx={6} fill={PAL.mist} stroke={PAL.primary} strokeWidth={4} strokeDasharray="12 9" />
			{CARDS.map((card, i) => (
				<CardShape key={i} c={card} dots={card.fill === PAL.primary ? ids.dotsWhite : undefined} />
			))}
			{thread.slice(0, 3).map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={9} fill={PAL.primary} stroke={PAL.white} strokeWidth={3} />
			))}

			{/* clinician in profile, pointing to a card */}
			<g transform={`rotate(${point} ${P2.x} ${P2.y})`}>
				<Side x={P2.x} y={P2.y} s={P2.s} dir={1} body={PAL.deep} coat wear="ghutra" arm="reach" standing />
			</g>

			{/* participant from behind, pressing the new card into the slot */}
			<g transform={`translate(${press * 0.4} ${press})`}>
				<CardShape c={{...NEW, fill: PAL.primary, rot: -4}} dots={ids.dotsWhite} />
			</g>
			<Person x={P1.x} y={P1.y} s={P1.s} back body={PAL.deep} wear="hijab" wearColor={PAL.mid} armL="down" armR="none" legs />
			<Limb pts={[[p1.shoulderR.x, p1.shoulderR.y], [p1.shoulderR.x + 52, p1.top - 8], hand]} s={P1.s} color={PAL.deep} edge={PAL.ink} />
			{/* a small stack of cards in the other hand */}
			<g transform={`rotate(-8 ${p1.shoulderL.x - 20} ${p1.top + 186})`}>
				<rect x={p1.shoulderL.x - 66} y={p1.top + 150} width={64} height={46} rx={4} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
				<rect x={p1.shoulderL.x - 60} y={p1.top + 158} width={64} height={46} rx={4} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
			</g>
			<circle cx={p1.shoulderL.x - 16} cy={p1.top + 186} r={17 * P1.s} fill={PAL.skin} />

			{/* foreground participant, from behind */}
			<Person x={P3.x} y={P3.y} s={P3.s} back body={PAL.mid} wear="none" armL="none" armR="none" />
			<BackHair x={P3.x} y={P3.y} s={P3.s} />
		</Frame>
	);
};

export default Workshop;
