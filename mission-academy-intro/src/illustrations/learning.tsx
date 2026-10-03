// "تعلّم" — a learner in hijab studies at a desk, chin resting on one hand,
// the other highlighting a line in an open book (right to left, as Arabic is
// read). A tablet beside the book shows a connected-nodes diagram; a second
// learner (ghutra) works at a desk further back. The learner and the book sit
// on the vertical centre line so the art survives the narrow pill crop. The
// desk runs off the bottom edge, so no crop shows empty space under it.
import {Doc, Frame, Halftone, Person, PAL, personAnchors, Table, useAmbientFrame, useIds} from './kit';

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
const LY = 880;
const LS = 1.6;

// Open book: pages meet at the gutter x = 600.
const BOOK_TOP = 778;
// The line being highlighted on the left-hand page; the marked part runs from
// the line's right end to the pen tip.
const LINE = {x1: 414, x2: 574, y: 838};
const TIP_X = 492;

export const focus = {
	center: [0.5, 0.58],
	/** The highlighted line in the open book. */
	notes: [(TIP_X + LINE.x2) / 2 / 1200, LINE.y / 1200],
	/** The learner's head and shoulders. */
	learner: [0.5, 0.46],
} as const;

const Learning: React.FC = () => {
	const ids = useIds('dots', 'dotsMark', 'dotsShade');
	const t = useAmbientFrame();
	const a = personAnchors(LX, LY, LS);
	// The highlighting hand drifts a few px along the line.
	const dx = Math.sin(t / 26) * 3;
	const tip: Pt = [TIP_X + dx, LINE.y + 3];
	const hand: Pt = [446 + dx, 892];
	const penAngle = (Math.atan2(hand[1] - tip[1], hand[0] - tip[0]) * 180) / Math.PI;

	// Text lines, right-aligned as in Arabic: [x1, x2, y].
	const lines = [
		[414, 574, 812],
		[436, 574, 864],
		[470, 574, 890],
		[626, 786, 812],
		[626, 786, 838],
		[648, 786, 864],
		[700, 786, 890],
	];

	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsMark} color={PAL.primary} spacing={9} r={2} opacity={0.5} />
				<Halftone id={ids.dotsShade} color={PAL.light} spacing={14} r={3.2} angle={45} />
			</defs>

			{/* backdrop */}
			<circle cx={620} cy={500} r={370} fill={`url(#${ids.dots})`} />

			{/* wall shelf with standing books (upper left) */}
			<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
				{[
					[176, 96, 26, PAL.deep],
					[206, 118, 32, PAL.white],
					[242, 104, 24, PAL.primary],
					[270, 84, 30, PAL.light],
				].map(([x, h, w, c], i) => (
					<rect key={i} x={x as number} y={420 - (h as number)} width={w as number} height={h as number} rx={4} fill={c as string} />
				))}
				<rect x={312} y={328} width={28} height={98} rx={4} fill={PAL.mid} transform="rotate(14 340 420)" />
				<rect x={150} y={420} width={250} height={14} rx={4} fill={PAL.white} />
			</g>
			<rect x={212} y={344} width={20} height={6} rx={3} fill={PAL.light} />
			<rect x={212} y={358} width={20} height={6} rx={3} fill={PAL.light} />

			{/* second learner at a desk further back (right) */}
			<g>
				<path d="M 846 690 L 846 730 M 1084 690 L 1084 730" stroke={PAL.ink} strokeWidth={8} strokeLinecap="round" />
				<Person x={966} y={684} s={0.8} body={PAL.mid} wear="ghutra" armL="none" armR="none" />
				<Table x={826} y={636} w={290} depth={42} />
				{/* laptop seen from behind: the lid faces away from us */}
				<path d="M 908 656 L 1024 656 L 1034 668 L 898 668 Z" fill={PAL.light} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<rect x={914} y={578} width={104} height={78} rx={7} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
			</g>

			{/* the learner */}
			<Person x={LX} y={LY} s={LS} body={PAL.primary} wear="hijab" wearColor={PAL.deep} armL="none" armR="none" />

			{/* desk top, running off the bottom edge */}
			<path d="M 150 724 L 1050 724 L 1196 1210 L 4 1210 Z" fill={PAL.pale} stroke={PAL.ink} strokeWidth={4} strokeLinejoin="round" />
			<path d="M 152 727 L 1048 727 L 1060 766 L 140 766 Z" fill={`url(#${ids.dotsShade})`} opacity={0.7} />

			{/* stack of books (back left of the desk) */}
			<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
				<rect x={176} y={792} width={164} height={30} rx={5} fill={PAL.deep} />
				<rect x={188} y={764} width={150} height={28} rx={5} fill={PAL.white} />
				<rect x={170} y={738} width={156} height={26} rx={5} fill={PAL.primary} />
			</g>
			<g fill={PAL.light}>
				<rect x={202} y={775} width={112} height={6} rx={3} />
			</g>
			<g fill={PAL.white}>
				<rect x={310} y={798} width={22} height={18} rx={2} />
				<rect x={306} y={744} width={12} height={14} rx={2} />
			</g>

			{/* loose notes and a mug near the front of the desk */}
			<Doc x={170} y={980} w={230} h={170} rotate={-8} lines={4} />
			<g>
				<rect x={898} y={1006} width={96} height={108} rx={12} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
				<path d="M 994 1030 Q 1036 1030 1036 1060 Q 1036 1090 994 1090" fill="none" stroke={PAL.ink} strokeWidth={3} />
				<path d="M 994 1044 Q 1020 1044 1020 1060 Q 1020 1076 994 1076" fill="none" stroke={PAL.ink} strokeWidth={3} />
				<ellipse cx={946} cy={1006} rx={48} ry={12} fill={PAL.deep} stroke={PAL.ink} strokeWidth={3} />
				<rect x={900} y={1048} width={92} height={22} fill={`url(#${ids.dotsShade})`} />
			</g>

			{/* open book */}
			<path
				d={`M 382 ${BOOK_TOP + 8} L 366 ${BOOK_TOP + 150} Q 486 ${BOOK_TOP + 140} 600 ${BOOK_TOP + 162} Q 714 ${BOOK_TOP + 140} 834 ${BOOK_TOP + 150} L 818 ${BOOK_TOP + 8} Q 714 ${BOOK_TOP} 600 ${BOOK_TOP + 18} Q 486 ${BOOK_TOP} 382 ${BOOK_TOP + 8} Z`}
				fill={PAL.deep}
				stroke={PAL.ink}
				strokeWidth={3}
				strokeLinejoin="round"
			/>
			<path
				d={`M 600 ${BOOK_TOP + 12} Q 508 ${BOOK_TOP - 12} 400 ${BOOK_TOP + 2} L 384 ${BOOK_TOP + 138} Q 498 ${BOOK_TOP + 126} 600 ${BOOK_TOP + 150} Z`}
				fill={PAL.paper}
				stroke={PAL.ink}
				strokeWidth={3}
				strokeLinejoin="round"
			/>
			<path
				d={`M 600 ${BOOK_TOP + 12} Q 692 ${BOOK_TOP - 12} 800 ${BOOK_TOP + 2} L 816 ${BOOK_TOP + 138} Q 702 ${BOOK_TOP + 126} 600 ${BOOK_TOP + 150} Z`}
				fill={PAL.paper}
				stroke={PAL.ink}
				strokeWidth={3}
				strokeLinejoin="round"
			/>
			<path d={`M 600 ${BOOK_TOP + 14} L 600 ${BOOK_TOP + 148}`} stroke={PAL.pale} strokeWidth={16} />
			<path d={`M 600 ${BOOK_TOP + 12} L 600 ${BOOK_TOP + 150}`} stroke={PAL.ink} strokeWidth={3} />
			{lines.map(([x1, x2, y], i) => (
				<rect key={i} x={x1} y={y - 4} width={x2 - x1} height={8} rx={4} fill={PAL.light} />
			))}
			{/* the line being highlighted */}
			<rect x={LINE.x1} y={LINE.y - 4} width={LINE.x2 - LINE.x1} height={8} rx={4} fill={PAL.light} />
			<rect x={tip[0] - 4} y={LINE.y - 15} width={LINE.x2 - tip[0] + 12} height={30} rx={4} fill={PAL.pale} />
			<rect x={tip[0] - 4} y={LINE.y - 15} width={LINE.x2 - tip[0] + 12} height={30} rx={4} fill={`url(#${ids.dotsMark})`} />
			<rect x={tip[0]} y={LINE.y - 5} width={LINE.x2 - tip[0]} height={10} rx={5} fill={PAL.primary} />

			{/* tablet lying on the desk, showing a connected diagram */}
			<g transform="translate(944 872) rotate(-8)">
				<rect x={-100} y={-68} width={200} height={136} rx={16} fill={PAL.ink} />
				<rect x={-88} y={-56} width={176} height={112} rx={8} fill={PAL.white} />
				<rect x={-74} y={-46} width={56} height={9} rx={4.5} fill={PAL.deep} />
				<path d="M -54 18 C -32 18 -24 -12 0 -12 C 24 -12 32 14 54 14" stroke={PAL.primary} strokeWidth={6} fill="none" strokeLinecap="round" />
				{[
					[-54, 18],
					[0, -12],
					[54, 14],
				].map(([cx, cy], i) => (
					<circle key={i} cx={cx} cy={cy} r={12} fill={i === 1 ? PAL.primary : PAL.white} stroke={PAL.primary} strokeWidth={4.5} />
				))}
				<rect x={-66} y={38} width={132} height={8} rx={4} fill={PAL.light} />
			</g>

			{/* arms: chin resting on one hand, the other highlighting */}
			<Limb pts={[[a.shoulderR.x, a.shoulderR.y], [770, 752], [644, 592]]} s={LS} color={PAL.primary} edge={PAL.deep} />
			<Limb pts={[[a.shoulderL.x, a.shoulderL.y], [392, 772], hand]} s={LS} color={PAL.primary} edge={PAL.deep} hand={false} />
			<g transform={`translate(${tip[0]} ${tip[1]}) rotate(${penAngle})`}>
				<path d="M -2 0 L 18 -8 L 18 8 Z" fill={PAL.ink} stroke={PAL.ink} strokeWidth={2} strokeLinejoin="round" />
				<rect x={16} y={-10} width={100} height={20} rx={7} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
				<rect x={86} y={-10} width={14} height={20} fill={PAL.deep} />
			</g>
			<circle cx={hand[0]} cy={hand[1]} r={17 * LS} fill={PAL.skin} />
		</Frame>
	);
};

export default Learning;
