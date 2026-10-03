// "تعلّم" — a learner in hijab studies at a desk: an open book with one line
// being highlighted, a tablet lying beside it with a connected-nodes diagram.
// A second learner (ghutra) works at a desk further back. The learner and the
// book sit on the vertical centre line so the art survives a narrow pill crop.
import {Frame, Halftone, Person, PAL, personAnchors, Table, useAmbientFrame, useIds} from './kit';

type Pt = readonly [number, number];

/** Arm drawn in the kit's style, through custom joints (shoulder → hand). */
const Limb: React.FC<{pts: Pt[]; s: number; color: string; coat?: boolean; hand?: boolean}> = ({
	pts,
	s,
	color,
	coat = false,
	hand = true,
}) => {
	const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
	const [hx, hy] = pts[pts.length - 1];
	return (
		<g>
			{coat ? (
				<path d={d} stroke={PAL.light} strokeWidth={40 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			) : null}
			<path d={d} stroke={coat ? PAL.white : color} strokeWidth={34 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			{hand ? <circle cx={hx} cy={hy} r={17 * s} fill={PAL.skin} /> : null}
		</g>
	);
};

// Main learner.
const LX = 600;
const LY = 790;
const LS = 1.5;

// The highlighted line on the right-hand page.
const MARK = {x1: 632, x2: 764, y: 791};

export const focus = {
	center: [0.5, 0.54],
	/** The highlighted line in the open book. */
	notes: [(MARK.x1 + MARK.x2) / 2 / 1200, MARK.y / 1200],
	/** The learner's head and shoulders. */
	learner: [0.5, 0.42],
} as const;

const Learning: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep', 'dotsPanel');
	const t = useAmbientFrame();
	const a = personAnchors(LX, LY, LS);
	// The writing hand drifts very slightly along the line.
	const dx = Math.sin(t / 26) * 3;
	const hand: Pt = [688 + dx, 824];
	const tip: Pt = [MARK.x1 + 2 + dx, MARK.y + 1];
	const penAngle = (Math.atan2(hand[1] - tip[1], hand[0] - tip[0]) * 180) / Math.PI;

	// Left (viewer) page / right page lines: right-aligned, as in Arabic text.
	const leftLines = [
		[440, 580, 768],
		[458, 580, 791],
		[440, 580, 814],
		[500, 580, 837],
	];
	const rightLines = [
		[620, 764, 768],
		[620, 764, 814],
		[684, 764, 837],
	];

	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={10} r={2.2} opacity={0.6} />
				<Halftone id={ids.dotsPanel} color={PAL.light} spacing={14} r={3} angle={45} />
			</defs>

			{/* backdrop */}
			<circle cx={620} cy={470} r={370} fill={`url(#${ids.dots})`} />
			<rect x={0} y={1010} width={1200} height={190} fill={PAL.pale} />

			{/* wall shelf with standing books (upper left) */}
			<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
				{[
					[176, 96, 26, PAL.deep],
					[206, 118, 32, PAL.white],
					[242, 104, 24, PAL.primary],
					[270, 84, 30, PAL.light],
				].map(([x, h, w, c], i) => (
					<rect key={i} x={x as number} y={392 - (h as number)} width={w as number} height={h as number} rx={4} fill={c as string} />
				))}
				<rect x={312} y={300} width={28} height={98} rx={4} fill={PAL.mid} transform="rotate(14 340 392)" />
				<rect x={150} y={392} width={250} height={14} rx={4} fill={PAL.white} />
			</g>
			<rect x={212} y={316} width={20} height={6} rx={3} fill={PAL.light} />
			<rect x={212} y={330} width={20} height={6} rx={3} fill={PAL.light} />

			{/* second learner at a desk further back (right) */}
			<g>
				<path d="M 836 660 L 836 712 M 1084 660 L 1084 712" stroke={PAL.ink} strokeWidth={8} strokeLinecap="round" />
				<Person x={958} y={652} s={0.8} body={PAL.mid} wear="ghutra" armL="none" armR="none" />
				<Table x={810} y={606} w={300} depth={44} />
				{/* laptop seen from behind: the lid faces away from us */}
				<path d="M 900 628 L 1018 628 L 1028 640 L 890 640 Z" fill={PAL.light} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<rect x={906} y={548} width={106} height={80} rx={7} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
				<circle cx={959} cy={588} r={9} fill={PAL.white} />
			</g>

			{/* the learner */}
			<Person x={LX} y={LY} s={LS} body={PAL.primary} wear="hijab" wearColor={PAL.deep} armL="none" armR="none" />

			{/* desk */}
			<path d="M 176 905 L 176 1120 M 1024 905 L 1024 1120" stroke={PAL.ink} strokeWidth={14} strokeLinecap="round" />
			<rect x={196} y={904} width={808} height={108} fill={`url(#${ids.dotsPanel})`} />
			<Table x={130} y={705} w={940} depth={180} />

			{/* stack of books (back left of the desk) */}
			<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
				<rect x={218} y={760} width={164} height={30} rx={5} fill={PAL.deep} />
				<rect x={232} y={732} width={150} height={28} rx={5} fill={PAL.light} />
				<rect x={212} y={706} width={156} height={26} rx={5} fill={PAL.primary} />
			</g>
			<g fill={PAL.white}>
				<rect x={352} y={766} width={22} height={18} rx={2} />
				<rect x={350} y={712} width={12} height={14} rx={2} />
			</g>

			{/* open book */}
			<path
				d="M 404 744 L 390 870 Q 500 860 600 880 Q 700 860 810 870 L 796 744 Q 700 736 600 754 Q 500 736 404 744 Z"
				fill={PAL.deep}
				stroke={PAL.ink}
				strokeWidth={3}
				strokeLinejoin="round"
			/>
			<path d="M 600 748 Q 520 726 424 738 L 410 858 Q 510 848 600 868 Z" fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			<path d="M 600 748 Q 680 726 776 738 L 790 858 Q 690 848 600 868 Z" fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			<path d="M 600 750 L 600 866" stroke={PAL.light} strokeWidth={10} />
			<path d="M 600 748 L 600 868" stroke={PAL.ink} strokeWidth={3} />
			{leftLines.map(([x1, x2, y], i) => (
				<rect key={`l${i}`} x={x1} y={y - 4} width={x2 - x1} height={8} rx={4} fill={PAL.light} />
			))}
			{rightLines.map(([x1, x2, y], i) => (
				<rect key={`r${i}`} x={x1} y={y - 4} width={x2 - x1} height={8} rx={4} fill={PAL.light} />
			))}
			{/* the highlighted line */}
			<rect x={tip[0] - 6} y={MARK.y - 13} width={MARK.x2 - tip[0] + 12} height={26} rx={4} fill={PAL.pale} />
			<rect x={tip[0] - 6} y={MARK.y - 13} width={MARK.x2 - tip[0] + 12} height={26} rx={4} fill={`url(#${ids.dotsDeep})`} opacity={0.5} />
			<rect x={tip[0]} y={MARK.y - 4} width={MARK.x2 - tip[0]} height={8} rx={4} fill={PAL.primary} />

			{/* tablet lying on the desk, showing a connected diagram */}
			<g transform="translate(892 798) rotate(-7)">
				<rect x={-98} y={-66} width={196} height={132} rx={16} fill={PAL.ink} />
				<rect x={-86} y={-54} width={172} height={108} rx={8} fill={PAL.white} />
				<rect x={-72} y={-44} width={58} height={8} rx={4} fill={PAL.deep} />
				<path d="M -52 14 C -30 14 -24 -14 0 -14 C 24 -14 30 12 52 12" stroke={PAL.primary} strokeWidth={5} fill="none" strokeLinecap="round" />
				{[
					[-52, 14],
					[0, -14],
					[52, 12],
				].map(([cx, cy], i) => (
					<circle key={i} cx={cx} cy={cy} r={11} fill={i === 1 ? PAL.primary : PAL.white} stroke={PAL.primary} strokeWidth={4} />
				))}
				<rect x={-66} y={34} width={132} height={8} rx={4} fill={PAL.light} />
			</g>

			{/* arms: one hand holds the page, the other highlights */}
			<Limb pts={[[a.shoulderL.x, a.shoulderL.y], [438, 716], [470, 826]]} s={LS} color={PAL.primary} />
			<Limb pts={[[a.shoulderR.x, a.shoulderR.y], [776, 714], hand]} s={LS} color={PAL.primary} hand={false} />
			<g transform={`translate(${tip[0]} ${tip[1]}) rotate(${penAngle})`}>
				<path d="M 0 0 L 16 -7 L 16 7 Z" fill={PAL.ink} />
				<rect x={14} y={-9} width={84} height={18} rx={6} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
				<rect x={74} y={-9} width={12} height={18} fill={PAL.deep} />
			</g>
			<circle cx={hand[0]} cy={hand[1]} r={17 * LS} fill={PAL.skin} />
		</Frame>
	);
};

export default Learning;
