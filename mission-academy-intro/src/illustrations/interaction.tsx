// "تطوّر" — peer exchange. Three professionals in conversation: a clinician
// in hijab and coat, a colleague holding a cup (further back), and a man in
// ghutra gesturing. Their two speech bubbles overlap, and a primary thread
// carries both up into a shared idea whose rising steps say "we grow".
import {Badge, Bubble, Frame, Halftone, Person, PAL, personAnchors, useAmbientFrame, useIds} from './kit';

type Pt = readonly [number, number];

/** The figure's garment continues past the bottom edge (no visible waist cut,
 * no legs): covers the kit torso's closing stroke and extends its sides. */
const Extend: React.FC<{x: number; y: number; s: number; fill: string; coat?: boolean}> = ({x, y, s, fill, coat = false}) => {
	const W = 156 * s;
	return (
		<g>
			<rect x={x - W / 2 + (coat ? 1.5 * s : 0)} y={y - (coat ? 2.5 * s : 1)} width={W - (coat ? 3 * s : 0)} height={260} fill={fill} />
			{coat ? (
				<g stroke={PAL.light} fill="none">
					<path d={`M ${x - W / 2} ${y - 2} L ${x - W / 2} ${y + 260} M ${x + W / 2} ${y - 2} L ${x + W / 2} ${y + 260}`} strokeWidth={3 * s} />
					<path d={`M ${x} ${y - 4} L ${x} ${y + 260}`} strokeWidth={4 * s} />
				</g>
			) : null}
		</g>
	);
};

/** Arm in the kit's style through custom joints, with a thin edge. */
const Limb: React.FC<{pts: Pt[]; s: number; color: string; edge: string}> = ({pts, s, color, edge}) => {
	const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
	const [hx, hy] = pts[pts.length - 1];
	return (
		<g>
			<path d={d} stroke={edge} strokeWidth={39 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} stroke={color} strokeWidth={34 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<circle cx={hx} cy={hy} r={17 * s} fill={PAL.skin} />
		</g>
	);
};

const A = {x: 330, y: 1000, s: 1.45}; // clinician, hijab + coat (left)
const B = {x: 600, y: 975, s: 1.2}; // colleague further back (middle)
const C = {x: 880, y: 1000, s: 1.45}; // ghutra, gesturing (right)

// Bubbles: [x, y, w, h].
const BA = {x: 298, y: 416, w: 330, h: 150};
const BC = {x: 570, y: 452, w: 320, h: 124};
const IDEA = {x: 470, y: 262, w: 260, h: 112};

export const focus = {
	center: [0.5, 0.52],
	/** The overlapping speech bubbles and the shared idea above them. */
	bubbles: [0.495, 0.36],
	/** The three people. */
	group: [0.5, 0.63],
} as const;

const Interaction: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep');
	const t = useAmbientFrame();
	const ba = Math.sin(t / 34) * 3;
	const bc = Math.sin(t / 34 + 2.1) * 3;
	const bi = Math.sin(t / 42 + 1) * 4;
	const a = personAnchors(A.x, A.y, A.s);
	const c = personAnchors(C.x, C.y, C.s);

	// Thread anchors: top edges of the two bubbles → sides of the idea.
	const fromA: Pt = [BA.x + 80, BA.y + ba];
	const fromC: Pt = [BC.x + BC.w - 70, BC.y + bc];
	const toL: Pt = [IDEA.x + 4, IDEA.y + IDEA.h * 0.5 + bi];
	const toR: Pt = [IDEA.x + IDEA.w - 4, IDEA.y + IDEA.h * 0.5 + bi];

	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={12} r={2.4} opacity={0.5} />
			</defs>

			{/* backdrop */}
			<circle cx={600} cy={560} r={430} fill={`url(#${ids.dots})`} />

			{/* colleague further back, cup in both hands */}
			<Person x={B.x} y={B.y} s={B.s} body={PAL.mid} wear="none" armL="rest" armR="rest" />
			<Extend x={B.x} y={B.y} s={B.s} fill={PAL.mid} />
			<g>
				<path d="M 576 902 L 624 902 L 620 950 Q 619 958 611 958 L 589 958 Q 581 958 580 950 Z" fill={PAL.white} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<rect x={580} y={916} width={40} height={12} fill={PAL.light} />
			</g>

			{/* clinician (left), leaning in a little */}
			<g transform={`rotate(2 ${A.x} 1150)`}>
			<Person x={A.x} y={A.y} s={A.s} coat body={PAL.deep} wear="hijab" wearColor={PAL.ink} armL="none" armR="none" />
			<Extend x={A.x} y={A.y} s={A.s} fill={PAL.white} coat />
			<Badge x={A.x} neckY={a.top} s={1} />
			{/* the kit's "down" and "hold" poses, redrawn above the extension */}
			<Limb pts={[[a.shoulderL.x, a.shoulderL.y], [a.shoulderL.x - 29, 890], [a.shoulderL.x - 23, 988]]} s={A.s} color={PAL.white} edge={PAL.light} />
			<Limb pts={[[a.shoulderR.x, a.shoulderR.y], [452, 907], [374, 919]]} s={A.s} color={PAL.white} edge={PAL.light} />
			</g>

			{/* ghutra, gesturing toward the others, leaning in */}
			<g transform={`rotate(-2 ${C.x} 1150)`}>
			<Person x={C.x} y={C.y} s={C.s} body={PAL.primary} wear="ghutra" armL="none" armR="none" />
			<Extend x={C.x} y={C.y} s={C.s} fill={PAL.primary} />
			<Limb pts={[[c.shoulderR.x, c.shoulderR.y], [c.shoulderR.x + 10, 900], [c.shoulderR.x + 2, 990]]} s={C.s} color={PAL.primary} edge={PAL.deep} />
			<Limb pts={[[c.shoulderL.x, c.shoulderL.y], [768, 890], [742, 766]]} s={C.s} color={PAL.primary} edge={PAL.deep} />
			</g>

			{/* cocktail table, cups on top */}
			<g>
				<rect x={588} y={1010} width={24} height={210} fill={PAL.ink} />
				<ellipse cx={600} cy={1014} rx={180} ry={28} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
				<ellipse cx={600} cy={1004} rx={180} ry={28} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
				<path d="M 488 968 L 524 968 L 521 1002 Q 520 1008 514 1008 L 498 1008 Q 492 1008 491 1002 Z" fill={PAL.white} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<rect x={491} y={980} width={31} height={9} fill={PAL.deep} />
				<path d="M 660 992 L 732 986 L 740 1006 L 664 1014 Z" fill={PAL.deep} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
			</g>

			{/* threads: both voices lift into one shared idea */}
			<g fill="none" stroke={PAL.primary} strokeWidth={6} strokeLinecap="round">
				<path d={`M ${fromA[0]} ${fromA[1]} C ${fromA[0] - 10} ${fromA[1] - 70} ${toL[0] - 70} ${toL[1]} ${toL[0]} ${toL[1]}`} />
				<path d={`M ${fromC[0]} ${fromC[1]} C ${fromC[0] + 10} ${fromC[1] - 90} ${toR[0] + 70} ${toR[1]} ${toR[0]} ${toR[1]}`} />
			</g>

			{/* the two overlapping speech bubbles */}
			<g transform={`translate(0 ${ba})`}>
				<Bubble x={BA.x} y={BA.y} w={BA.w} h={BA.h} tail="left" />
			</g>
			<g transform={`translate(0 ${bc})`}>
				<Bubble x={BC.x} y={BC.y} w={BC.w} h={BC.h} tail="right" fill={PAL.pale} lineColor={PAL.mid} />
			</g>

			{/* the shared idea: rising steps */}
			<g transform={`translate(0 ${bi})`}>
				<rect x={IDEA.x + 8} y={IDEA.y + 10} width={IDEA.w} height={IDEA.h} rx={IDEA.h * 0.3} fill={`url(#${ids.dotsDeep})`} />
				<rect x={IDEA.x} y={IDEA.y} width={IDEA.w} height={IDEA.h} rx={IDEA.h * 0.3} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
				{[0, 1, 2].map((i) => {
					const h = 20 + i * 22;
					const x = IDEA.x + 62 + i * 50;
					return <rect key={i} x={x} y={IDEA.y + IDEA.h - 22 - h} width={40} height={h} rx={5} fill={i === 2 ? PAL.white : PAL.light} />;
				})}
			</g>

			{/* thread dots at both ends */}
			{[fromA, fromC, toL, toR].map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={11} fill={i < 2 ? PAL.white : PAL.primary} stroke={PAL.primary} strokeWidth={5} />
			))}
		</Frame>
	);
};

export default Interaction;
