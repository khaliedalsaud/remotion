// "Knowledge" detail: open reference material on a desk, seen from above. One
// line of the book is being highlighted (right-to-left, as Arabic reads) by a
// hand holding a marker; index cards and a tablet with a small concept map sit
// around it.
import {Frame, Halftone, PAL, useAmbientFrame, useIds} from './kit';

type Pt = {x: number; y: number};

const rot = (p: Pt, c: Pt, deg: number): Pt => {
	const a = (deg * Math.PI) / 180;
	const dx = p.x - c.x;
	const dy = p.y - c.y;
	return {x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a)};
};
const f = (v: number) => Math.round((v / 1200) * 1000) / 1000;

// Book geometry (book-local coordinates, then rotated about BOOK_C).
const BOOK_C = {x: 565, y: 600};
const BOOK_ROT = -3;
const SPINE = 565;
/** The highlighted line on the right-hand page. */
const HL = {x1: 604, x2: 852, y: 584};
const TIP = rot({x: HL.x1 - 4, y: HL.y}, BOOK_C, BOOK_ROT);
const HL_CENTER = rot({x: (HL.x1 + HL.x2) / 2, y: HL.y}, BOOK_C, BOOK_ROT);

export const focus = {
	center: [0.5, 0.5],
	/** The highlighted line in the book (callout target). */
	detail: [f(HL_CENTER.x), f(HL_CENTER.y)],
	/** The marker tip at the end of the highlight. */
	marker: [f(TIP.x), f(TIP.y)],
	/** The concept map on the tablet. */
	tablet: [f(262), f(925)],
} as const;

/** A rounded bar drawn with an ink outline (double stroke). */
const Capsule: React.FC<{x1: number; y1: number; x2: number; y2: number; w: number; fill: string; outline?: number}> = ({
	x1,
	y1,
	x2,
	y2,
	w,
	fill,
	outline = 3,
}) => (
	<g>
		<line x1={x1} y1={y1} x2={x2} y2={y2} stroke={PAL.ink} strokeWidth={w + outline * 2} strokeLinecap="round" />
		<line x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth={w} strokeLinecap="round" />
	</g>
);

/**
 * A right hand holding a slim tool, seen from above. Local frame: the tool tip
 * is the origin and the tool runs along +x toward the wrist; the forearm leaves
 * the wrist at `forearm` degrees from the tool axis.
 */
const PenHand: React.FC<{
	x: number;
	y: number;
	angle: number;
	forearm?: number;
	sleeve: string;
	cuff: string;
	hand?: string;
	pen: React.ReactNode;
}> = ({x, y, angle, forearm = 36, sleeve, cuff, hand = PAL.skin, pen}) => (
	<g transform={`translate(${x} ${y}) rotate(${angle})`}>
		<g transform={`translate(236 46) rotate(${forearm})`}>
			<Capsule x1={-40} y1={0} x2={60} y2={0} w={104} fill={hand} />
			<rect x={70} y={-74} width={900} height={148} fill={sleeve} stroke={PAL.ink} strokeWidth={3} />
			<rect x={56} y={-80} width={40} height={160} rx={10} fill={cuff} stroke={PAL.ink} strokeWidth={3} />
		</g>
		<ellipse cx={172} cy={26} rx={88} ry={64} fill={hand} stroke={PAL.ink} strokeWidth={3} transform="rotate(14 172 26)" />
		{/* middle finger under the tool */}
		<Capsule x1={164} y1={-26} x2={92} y2={-24} w={30} fill={hand} />
		{pen}
		{/* thumb and index finger pinch the tool */}
		<Capsule x1={176} y1={56} x2={92} y2={22} w={34} fill={hand} />
		<Capsule x1={186} y1={-4} x2={70} y2={-6} w={32} fill={hand} />
	</g>
);

const Marker: React.FC = () => (
	<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
		<path d="M 2 -7 L 28 -13 L 28 13 L 2 7 Z" fill={PAL.primary} />
		<rect x={26} y={-15} width={26} height={30} rx={4} fill={PAL.light} />
		<rect x={50} y={-17} width={270} height={34} rx={14} fill={PAL.deep} />
		<rect x={286} y={-17} width={34} height={34} rx={10} fill={PAL.primary} />
	</g>
);

/** Right-aligned text bars (RTL). */
const Lines: React.FC<{right: number; ys: number[]; widths: number[]; color?: string}> = ({right, ys, widths, color = PAL.light}) => (
	<g>
		{ys.map((y, i) => {
			const w = widths[i % widths.length];
			return <rect key={i} x={right - w} y={y - 4} width={w} height={8} rx={4} fill={color} />;
		})}
	</g>
);

const Card: React.FC<{x: number; y: number; w: number; h: number; rotate: number; fill?: string; children?: React.ReactNode}> = ({
	x,
	y,
	w,
	h,
	rotate,
	fill = PAL.paper,
	children,
}) => (
	<g transform={`rotate(${rotate} ${x + w / 2} ${y + h / 2})`}>
		<rect x={x + 8} y={y + 12} width={w} height={h} rx={8} fill={PAL.ink} opacity={0.08} />
		<rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={PAL.ink} strokeWidth={3} />
		{children}
	</g>
);

const Knowledge: React.FC = () => {
	const ids = useIds('dots', 'spine', 'deepDots');
	const t = useAmbientFrame();
	const drift = Math.sin(t / 42) * 3;
	const handAngle = 34;
	const a = (BOOK_ROT * Math.PI) / 180;
	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.spine} color={PAL.light} spacing={10} r={2.4} angle={0} />
				<Halftone id={ids.deepDots} color={PAL.primary} spacing={12} r={2.4} opacity={0.6} />
			</defs>
			<circle cx={560} cy={560} r={480} fill={`url(#${ids.dots})`} />

			{/* index cards, top right */}
			<Card x={850} y={214} w={250} h={168} rotate={9} fill={PAL.pale} />
			<Card x={838} y={236} w={250} h={168} rotate={2}>
				<rect x={866} y={262} width={10} height={116} rx={5} fill={PAL.primary} />
				<Lines right={1060} ys={[272, 300, 328, 356]} widths={[150, 120, 160, 96]} />
			</Card>

			{/* tablet, bottom left, with a small concept map */}
			<g transform="rotate(-7 262 918)">
				<rect x={92} y={792} width={340} height={252} rx={24} fill={PAL.ink} opacity={0.08} transform="translate(10 14)" />
				<rect x={92} y={792} width={340} height={252} rx={24} fill={PAL.ink} />
				<rect x={108} y={808} width={308} height={220} rx={12} fill={PAL.white} />
				<path d="M 172 950 C 204 950 220 902 262 902 C 304 902 320 950 352 950" stroke={PAL.primary} strokeWidth={6} fill="none" strokeLinecap="round" />
				<circle cx={262} cy={902} r={26} fill={PAL.primary} />
				<circle cx={172} cy={950} r={20} fill={PAL.white} stroke={PAL.primary} strokeWidth={5} />
				<circle cx={352} cy={950} r={20} fill={PAL.white} stroke={PAL.primary} strokeWidth={5} />
				{[172, 262, 352].map((cx) => (
					<g key={cx}>
						<rect x={cx - 30} y={984} width={60} height={7} rx={3.5} fill={PAL.light} />
						<rect x={cx - 20} y={998} width={40} height={7} rx={3.5} fill={PAL.light} />
					</g>
				))}
			</g>

			{/* open book */}
			<g transform={`rotate(${BOOK_ROT} ${BOOK_C.x} ${BOOK_C.y})`}>
				<rect x={226} y={366} width={690} height={480} rx={16} fill={PAL.ink} opacity={0.1} transform="translate(12 16)" />
				<rect x={216} y={356} width={698} height={486} rx={16} fill={PAL.deep} stroke={PAL.ink} strokeWidth={4} />
				{/* page block thickness */}
				<path d={`M 234 380 L 234 828 Q 400 818 ${SPINE} 838 Q 730 818 896 828 L 896 380`} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
				<path d={`M 240 376 Q 400 362 540 372 Q 560 376 ${SPINE} 390 L ${SPINE} 828 Q 552 814 538 812 Q 400 804 240 816 Z`} fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<path d={`M 890 376 Q 730 362 590 372 Q 570 376 ${SPINE} 390 L ${SPINE} 828 Q 578 814 592 812 Q 730 804 890 816 Z`} fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<rect x={528} y={396} width={34} height={410} fill={`url(#${ids.spine})`} />
				<rect x={568} y={396} width={22} height={410} fill={`url(#${ids.spine})`} />

				{/* left page: heading, figure, text */}
				<rect x={384} y={408} width={128} height={16} rx={5} fill={PAL.deep} />
				<rect x={282} y={446} width={230} height={150} rx={10} fill={PAL.mist} stroke={PAL.ink} strokeWidth={3} />
				<circle cx={358} cy={521} r={50} fill={`url(#${ids.deepDots})`} />
				<circle cx={358} cy={521} r={50} fill="none" stroke={PAL.primary} strokeWidth={5} />
				<circle cx={358} cy={521} r={22} fill={PAL.primary} />
				<path d="M 404 500 L 440 482 L 490 482 M 400 548 L 440 566 L 490 566" stroke={PAL.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
				<rect x={452} y={490} width={42} height={7} rx={3.5} fill={PAL.light} />
				<rect x={452} y={548} width={42} height={7} rx={3.5} fill={PAL.light} />
				<Lines right={512} ys={[632, 662, 692, 722, 752, 782]} widths={[230, 210, 150, 230, 196, 120]} />

				{/* right page: heading, text, the highlighted line */}
				<rect x={724} y={408} width={128} height={16} rx={5} fill={PAL.deep} />
				<Lines right={852} ys={[454, 484, 514, 544]} widths={[248, 230, 248, 170]} />
				<rect x={HL.x1 - 10} y={HL.y - 22} width={HL.x2 - HL.x1 + 20} height={44} rx={6} fill={PAL.pale} />
				<rect x={HL.x1} y={HL.y - 6} width={HL.x2 - HL.x1} height={12} rx={6} fill={PAL.primary} />
				<rect x={866} y={HL.y - 22} width={8} height={44} rx={4} fill={PAL.primary} />
				<Lines right={852} ys={[624, 654, 684, 714, 744, 774]} widths={[248, 210, 248, 236, 160, 248]} />

				{/* sticky tabs and ribbon */}
				<rect x={888} y={452} width={34} height={46} rx={5} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
				<rect x={888} y={512} width={34} height={46} rx={5} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
				<path d={`M ${SPINE - 12} 836 L ${SPINE - 24} 930 L ${SPINE - 4} 912 L ${SPINE + 10} 936 L ${SPINE + 12} 836 Z`} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			</g>

			{/* hand with marker, finishing the highlight */}
			<PenHand
				x={TIP.x + Math.cos(a) * drift}
				y={TIP.y + Math.sin(a) * drift}
				angle={handAngle}
				sleeve={PAL.white}
				cuff={PAL.light}
				pen={<Marker />}
			/>
		</Frame>
	);
};

export default Knowledge;
