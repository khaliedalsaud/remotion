// "Apply" detail: a case checklist on a clipboard, seen from above. Two rows
// are already ticked; a hand with a pen is ticking the third. Beside it a
// tablet shows the same idea as a flow of three connected steps.
import {Frame, Halftone, PAL, useAmbientFrame, useIds} from './kit';

type Pt = {x: number; y: number};

const rot = (p: Pt, c: Pt, deg: number): Pt => {
	const a = (deg * Math.PI) / 180;
	const dx = p.x - c.x;
	const dy = p.y - c.y;
	return {x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a)};
};
const f = (v: number) => Math.round((v / 1200) * 1000) / 1000;

// Clipboard geometry (clipboard-local coordinates, rotated about CB_C).
const CB_C = {x: 700, y: 580};
const CB_ROT = 3;
const BOX = 54;
const BOX_X = 786;
const ROWS = [478, 616, 754];
/** Check mark points for a box whose top-left is (x, y). */
const checkPts = (x: number, y: number) => ({
	a: {x: x + 10, y: y + 28},
	b: {x: x + 24, y: y + 44},
	c: {x: x + 58, y: y - 8},
});
const LAST = checkPts(BOX_X, ROWS[2] - BOX / 2);
const PROGRESS = 0.5;
const PEN_LOCAL = {x: LAST.b.x + (LAST.c.x - LAST.b.x) * PROGRESS, y: LAST.b.y + (LAST.c.y - LAST.b.y) * PROGRESS};
const PEN = rot(PEN_LOCAL, CB_C, CB_ROT);
const BOX3 = rot({x: BOX_X + BOX / 2, y: ROWS[2]}, CB_C, CB_ROT);

export const focus = {
	center: [0.5, 0.5],
	/** The third check box, being ticked (callout target). */
	detail: [f(BOX3.x), f(BOX3.y)],
	/** The pen tip drawing the check. */
	pen: [f(PEN.x), f(PEN.y)],
	/** The flow of three steps on the tablet. */
	flow: [f(270), f(560)],
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
		<Capsule x1={164} y1={-26} x2={92} y2={-24} w={30} fill={hand} />
		{pen}
		<Capsule x1={176} y1={56} x2={92} y2={22} w={34} fill={hand} />
		<Capsule x1={186} y1={-4} x2={70} y2={-6} w={32} fill={hand} />
	</g>
);

const Pen: React.FC = () => (
	<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
		<path d="M 0 0 L 34 -9 L 34 9 Z" fill={PAL.light} />
		<circle cx={1} cy={0} r={4} fill={PAL.ink} stroke="none" />
		<rect x={32} y={-13} width={40} height={26} rx={6} fill={PAL.mid} />
		<rect x={70} y={-15} width={250} height={30} rx={13} fill={PAL.white} />
		<rect x={286} y={-15} width={34} height={30} rx={11} fill={PAL.primary} />
		<rect x={210} y={-22} width={96} height={10} rx={5} fill={PAL.primary} />
	</g>
);

/** Right-aligned text bars (RTL). */
const Lines: React.FC<{right: number; ys: number[]; widths: number[]; color?: string; h?: number}> = ({
	right,
	ys,
	widths,
	color = PAL.light,
	h = 9,
}) => (
	<g>
		{ys.map((y, i) => {
			const w = widths[i % widths.length];
			return <rect key={i} x={right - w} y={y - h / 2} width={w} height={h} rx={h / 2} fill={color} />;
		})}
	</g>
);

const Check: React.FC<{x: number; y: number; progress?: number}> = ({x, y, progress = 1}) => {
	const {a, b, c} = checkPts(x, y);
	const end = {x: b.x + (c.x - b.x) * progress, y: b.y + (c.y - b.y) * progress};
	return (
		<path
			d={`M ${a.x} ${a.y} L ${b.x} ${b.y} L ${end.x} ${end.y}`}
			stroke={PAL.primary}
			strokeWidth={10}
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	);
};

const Apply: React.FC = () => {
	const ids = useIds('dots', 'halo', 'board');
	const t = useAmbientFrame();
	const wobble = Math.sin(t / 36) * 0.8;
	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.halo} color={PAL.primary} spacing={11} r={2.2} angle={0} opacity={0.5} />
				<Halftone id={ids.board} color={PAL.deep} spacing={12} r={2.4} opacity={0.35} />
			</defs>
			<circle cx={620} cy={580} r={490} fill={`url(#${ids.dots})`} />

			{/* case folder peeking out from under the clipboard */}
			<g transform="rotate(9 860 420)">
				<rect x={700} y={240} width={330} height={400} rx={12} fill={PAL.ink} opacity={0.08} transform="translate(10 14)" />
				<path d="M 700 262 L 700 640 L 1030 640 L 1030 262 L 900 262 L 884 236 L 790 236 L 774 262 Z" fill={PAL.light} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<rect x={724} y={286} width={290} height={330} rx={6} fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} />
				<Lines right={990} ys={[320, 348, 376]} widths={[150, 220, 120]} />
			</g>

			{/* tablet with a three-step flow */}
			<g transform="rotate(-6 270 560)">
				<rect x={110} y={320} width={320} height={480} rx={28} fill={PAL.ink} opacity={0.08} transform="translate(10 14)" />
				<rect x={110} y={320} width={320} height={480} rx={28} fill={PAL.ink} />
				<rect x={126} y={338} width={288} height={444} rx={12} fill={PAL.white} />
				<rect x={262} y={366} width={124} height={14} rx={5} fill={PAL.deep} />
				<path d="M 330 436 C 330 494 210 494 210 556 C 210 618 330 618 330 676" stroke={PAL.primary} strokeWidth={7} fill="none" strokeLinecap="round" />
				<circle cx={330} cy={676} r={50} fill={`url(#${ids.halo})`} />
				<circle cx={330} cy={436} r={26} fill={PAL.primary} />
				<circle cx={210} cy={556} r={26} fill={PAL.primary} />
				<circle cx={330} cy={676} r={26} fill={PAL.white} stroke={PAL.primary} strokeWidth={7} />
				<Lines right={286} ys={[428, 446]} widths={[110, 76]} h={8} />
				<Lines right={386} ys={[548, 566]} widths={[124, 84]} h={8} />
				<Lines right={286} ys={[668, 686]} widths={[110, 70]} h={8} />
				<rect x={152} y={734} width={236} height={18} rx={9} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
				<rect x={231} y={734} width={157} height={18} rx={9} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
			</g>

			{/* clipboard with the case checklist */}
			<g transform={`rotate(${CB_ROT} ${CB_C.x} ${CB_C.y})`}>
				<rect x={474} y={262} width={452} height={650} rx={22} fill={PAL.ink} opacity={0.1} transform="translate(12 16)" />
				<rect x={474} y={262} width={452} height={650} rx={22} fill={PAL.deep} stroke={PAL.ink} strokeWidth={4} />
				<rect x={500} y={306} width={400} height={584} rx={6} fill={PAL.paper} stroke={PAL.ink} strokeWidth={3} />
				{/* clip */}
				<rect x={610} y={240} width={180} height={60} rx={14} fill={PAL.light} stroke={PAL.ink} strokeWidth={4} />
				<rect x={636} y={282} width={128} height={36} rx={8} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
				<circle cx={700} cy={262} r={9} fill={PAL.mist} stroke={PAL.ink} strokeWidth={3} />

				{/* header */}
				<rect x={700} y={350} width={160} height={18} rx={6} fill={PAL.deep} />
				<Lines right={860} ys={[390]} widths={[230]} />
				<rect x={540} y={348} width={60} height={60} rx={10} fill={`url(#${ids.board})`} stroke={PAL.ink} strokeWidth={3} />

				{/* rows */}
				{ROWS.map((ry, i) => (
					<g key={ry}>
						<line x1={530} y1={ry - 70} x2={870} y2={ry - 70} stroke={PAL.pale} strokeWidth={4} />
						<rect
							x={BOX_X}
							y={ry - BOX / 2}
							width={BOX}
							height={BOX}
							rx={10}
							fill={i < 2 ? PAL.pale : PAL.white}
							stroke={PAL.ink}
							strokeWidth={3}
						/>
						<Lines right={756} ys={[ry - 12, ry + 14]} widths={i === 1 ? [190, 130] : [210, 150]} color={i < 2 ? PAL.light : PAL.mid} />
						{i < 2 ? <Check x={BOX_X} y={ry - BOX / 2} /> : <Check x={BOX_X} y={ry - BOX / 2} progress={PROGRESS} />}
					</g>
				))}
				<line x1={530} y1={ROWS[2] + 70} x2={870} y2={ROWS[2] + 70} stroke={PAL.pale} strokeWidth={4} />
			</g>

			{/* hand ticking the third row */}
			<g transform={`rotate(${wobble} ${PEN.x} ${PEN.y})`}>
				<PenHand x={PEN.x} y={PEN.y} angle={38} forearm={28} sleeve={PAL.white} cuff={PAL.primary} pen={<Pen />} />
			</g>
		</Frame>
	);
};

export default Apply;
