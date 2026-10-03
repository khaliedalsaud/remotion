// "تعلّم" — a learner in hijab studies at a desk: an open book with a line
// being highlighted (right to left, as Arabic is read), a tablet beside it
// with a connected-nodes diagram. A second learner (ghutra) works at a desk
// further back. The learner and the book sit on the vertical centre line so
// the art survives the narrow pill crop.
import {Frame, Halftone, Person, PAL, personAnchors, Table, useAmbientFrame, useIds} from './kit';

type Pt = readonly [number, number];

/** Arm in the kit's style through custom joints, with a thin edge so it
 * reads against a torso of the same colour. */
const Limb: React.FC<{pts: Pt[]; s: number; color: string; edge: string; hand?: boolean}> = ({
	pts,
	s,
	color,
	edge,
	hand = true,
}) => {
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

// Main learner (waist hidden behind the desk).
const LX = 600;
const LY = 850;
const LS = 1.5;

// The line being highlighted, on the right-hand page.
const LINE = {x1: 620, x2: 764, y: 831};
const TIP_X = 684;

export const focus = {
	center: [0.5, 0.58],
	/** The highlighted line in the open book. */
	notes: [(TIP_X + LINE.x2) / 2 / 1200, LINE.y / 1200],
	/** The learner's head and shoulders. */
	learner: [0.5, 0.47],
} as const;

const Learning: React.FC = () => {
	const ids = useIds('dots', 'dotsMark', 'dotsShade');
	const t = useAmbientFrame();
	const a = personAnchors(LX, LY, LS);
	// The highlighting hand drifts a few px along the line.
	const dx = Math.sin(t / 26) * 3;
	const hand: Pt = [730 + dx, 892];
	const tip: Pt = [TIP_X + dx, LINE.y + 2];
	const penAngle = (Math.atan2(hand[1] - tip[1], hand[0] - tip[0]) * 180) / Math.PI;

	// Text lines, right-aligned as in Arabic: [x1, x2, y].
	const lines = [
		[440, 580, 808],
		[458, 580, 831],
		[440, 580, 854],
		[500, 580, 877],
		[620, 764, 808],
		[620, 764, 854],
		[684, 764, 877],
	];

	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsMark} color={PAL.primary} spacing={9} r={2} opacity={0.55} />
				<Halftone id={ids.dotsShade} color={PAL.light} spacing={14} r={3.2} angle={45} />
			</defs>

			{/* backdrop */}
			<circle cx={620} cy={510} r={370} fill={`url(#${ids.dots})`} />

			{/* wall shelf with standing books (upper left) */}
			<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
				{[
					[176, 96, 26, PAL.deep],
					[206, 118, 32, PAL.white],
					[242, 104, 24, PAL.primary],
					[270, 84, 30, PAL.light],
				].map(([x, h, w, c], i) => (
					<rect key={i} x={x as number} y={432 - (h as number)} width={w as number} height={h as number} rx={4} fill={c as string} />
				))}
				<rect x={312} y={340} width={28} height={98} rx={4} fill={PAL.mid} transform="rotate(14 340 432)" />
				<rect x={150} y={432} width={250} height={14} rx={4} fill={PAL.white} />
			</g>
			<rect x={212} y={356} width={20} height={6} rx={3} fill={PAL.light} />
			<rect x={212} y={370} width={20} height={6} rx={3} fill={PAL.light} />

			{/* second learner at a desk further back (right) */}
			<g>
				<path d="M 836 700 L 836 752 M 1084 700 L 1084 752" stroke={PAL.ink} strokeWidth={8} strokeLinecap="round" />
				<Person x={958} y={692} s={0.8} body={PAL.mid} wear="ghutra" armL="none" armR="none" />
				<Table x={810} y={646} w={300} depth={44} />
				{/* laptop seen from behind: the lid faces away from us */}
				<path d="M 900 668 L 1018 668 L 1028 680 L 890 680 Z" fill={PAL.light} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<rect x={906} y={588} width={106} height={80} rx={7} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
				<circle cx={959} cy={628} r={9} fill={PAL.white} />
			</g>

			{/* the learner */}
			<Person x={LX} y={LY} s={LS} body={PAL.primary} wear="hijab" wearColor={PAL.deep} armL="none" armR="none" />

			{/* desk: front panel, then the top */}
			<rect x={150} y={948} width={900} height={270} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
			<rect x={152} y={951} width={896} height={52} fill={`url(#${ids.dotsShade})`} />
			<Table x={120} y={745} w={960} depth={190} />

			{/* stack of books (back left of the desk) */}
			<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
				<rect x={186} y={800} width={164} height={30} rx={5} fill={PAL.deep} />
				<rect x={198} y={772} width={150} height={28} rx={5} fill={PAL.light} />
				<rect x={180} y={746} width={156} height={26} rx={5} fill={PAL.primary} />
			</g>
			<g fill={PAL.white}>
				<rect x={320} y={806} width={22} height={18} rx={2} />
				<rect x={318} y={752} width={12} height={14} rx={2} />
			</g>

			{/* open book */}
			<path
				d="M 404 784 L 390 910 Q 500 900 600 920 Q 700 900 810 910 L 796 784 Q 700 776 600 794 Q 500 776 404 784 Z"
				fill={PAL.deep}
				stroke={PAL.ink}
				strokeWidth={3}
				strokeLinejoin="round"
			/>
			<path d="M 600 788 Q 520 766 424 778 L 410 898 Q 510 888 600 908 Z" fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			<path d="M 600 788 Q 680 766 776 778 L 790 898 Q 690 888 600 908 Z" fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			<path d="M 600 790 L 600 906" stroke={PAL.pale} strokeWidth={14} />
			<path d="M 600 788 L 600 908" stroke={PAL.ink} strokeWidth={3} />
			{lines.map(([x1, x2, y], i) => (
				<rect key={i} x={x1} y={y - 4} width={x2 - x1} height={8} rx={4} fill={PAL.light} />
			))}
			{/* the line being highlighted: the marked part runs from the right end to the pen */}
			<rect x={LINE.x1} y={LINE.y - 4} width={LINE.x2 - LINE.x1} height={8} rx={4} fill={PAL.light} />
			<rect x={tip[0] - 4} y={LINE.y - 15} width={LINE.x2 - tip[0] + 12} height={30} rx={4} fill={PAL.pale} />
			<rect x={tip[0] - 4} y={LINE.y - 15} width={LINE.x2 - tip[0] + 12} height={30} rx={4} fill={`url(#${ids.dotsMark})`} />
			<rect x={tip[0]} y={LINE.y - 5} width={LINE.x2 - tip[0]} height={10} rx={5} fill={PAL.primary} />

			{/* tablet lying on the desk, showing a connected diagram */}
			<g transform="translate(958 852) rotate(-7)">
				<rect x={-90} y={-62} width={180} height={124} rx={16} fill={PAL.ink} />
				<rect x={-78} y={-50} width={156} height={100} rx={8} fill={PAL.white} />
				<rect x={-64} y={-40} width={52} height={8} rx={4} fill={PAL.deep} />
				<path d="M -48 14 C -28 14 -22 -12 0 -12 C 22 -12 28 12 48 12" stroke={PAL.primary} strokeWidth={5} fill="none" strokeLinecap="round" />
				{[
					[-48, 14],
					[0, -12],
					[48, 12],
				].map(([cx, cy], i) => (
					<circle key={i} cx={cx} cy={cy} r={10} fill={i === 1 ? PAL.primary : PAL.white} stroke={PAL.primary} strokeWidth={4} />
				))}
				<rect x={-60} y={32} width={120} height={7} rx={3.5} fill={PAL.light} />
			</g>

			{/* arms: one hand holds the page open, the other highlights */}
			<Limb pts={[[a.shoulderL.x, a.shoulderL.y], [398, 800], [462, 888]]} s={LS} color={PAL.primary} edge={PAL.deep} />
			<Limb pts={[[a.shoulderR.x, a.shoulderR.y], [826, 806], hand]} s={LS} color={PAL.primary} edge={PAL.deep} hand={false} />
			<g transform={`translate(${tip[0]} ${tip[1]}) rotate(${penAngle})`}>
				<path d="M -2 0 L 18 -8 L 18 8 Z" fill={PAL.ink} stroke={PAL.ink} strokeWidth={2} strokeLinejoin="round" />
				<rect x={16} y={-10} width={98} height={20} rx={7} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
				<rect x={84} y={-10} width={14} height={20} fill={PAL.deep} />
			</g>
			<circle cx={hand[0]} cy={hand[1]} r={17 * LS} fill={PAL.skin} />
		</Frame>
	);
};

export default Learning;
