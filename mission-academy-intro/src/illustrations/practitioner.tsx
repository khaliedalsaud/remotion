// The health practitioner — hero bust for the centre of Scene 3. A man in
// ghutra and a white clinical coat, ID lanyard on his chest, holds a tablet
// with a case file. Behind him: a soft arch, a halftone disc and quiet
// training-room shapes (shelving, a wall board) kept pale so he stays the
// subject. The coat runs off the bottom edge so no crop shows a cut torso.
import {Badge, Frame, Halftone, Person, PAL, personAnchors, useAmbientFrame, useIds} from './kit';

type Pt = readonly [number, number];

/** Coat sleeve in the kit's style through custom joints. */
const Sleeve: React.FC<{pts: Pt[]; s: number; hand?: boolean}> = ({pts, s, hand = true}) => {
	const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
	const [hx, hy] = pts[pts.length - 1];
	return (
		<g>
			<path d={d} stroke={PAL.light} strokeWidth={40 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<path d={d} stroke={PAL.white} strokeWidth={34 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			{hand ? <circle cx={hx} cy={hy} r={17 * s} fill={PAL.skin} /> : null}
		</g>
	);
};

const X = 600;
const Y = 1060;
const S = 2.4;

// Tablet: centre, size, tilt.
const TAB = {cx: 772, cy: 978, w: 212, h: 276, rot: -8};

export const focus = {
	center: [0.5, 0.56],
	/** The head. */
	face: [0.5, 0.445],
	/** The ID card on the lanyard. */
	badge: [0.5, 0.726],
	/** Hands holding the tablet. */
	hands: [0.64, 0.82],
} as const;

const Practitioner: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep', 'dotsShelf');
	const t = useAmbientFrame();
	const a = personAnchors(X, Y, S);
	// Very slow breathing: the whole figure rises and settles by ~2px.
	const breathe = Math.sin(t / 45) * 2;
	const drift = Math.sin(t / 60) * 4;
	const W = a.W;

	// Hands on the tablet's left and right edges (tablet-local → world).
	const rad = (TAB.rot * Math.PI) / 180;
	const toWorld = (lx: number, ly: number): Pt => [
		TAB.cx + lx * Math.cos(rad) - ly * Math.sin(rad),
		TAB.cy + lx * Math.sin(rad) + ly * Math.cos(rad),
	];
	const handL = toWorld(-TAB.w / 2 + 4, 34);
	const handR = toWorld(TAB.w / 2 - 2, 60);

	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={14} r={3} opacity={0.6} />
				<Halftone id={ids.dotsShelf} color={PAL.light} spacing={12} r={2.6} angle={45} />
			</defs>

			{/* soft arch behind the figure */}
			<path d="M 250 1200 L 250 560 A 350 350 0 0 1 950 560 L 950 1200 Z" fill={PAL.pale} />

			{/* training-room shapes: shelving (left), wall board on a rail (right) */}
			<g stroke={PAL.light} strokeWidth={4} strokeLinejoin="round">
				<rect x={96} y={330} width={196} height={620} rx={10} fill={PAL.white} />
				{[480, 640, 800].map((y) => (
					<path key={y} d={`M 96 ${y} L 292 ${y}`} />
				))}
				<rect x={120} y={402} width={56} height={78} rx={5} fill={PAL.pale} />
				<rect x={186} y={420} width={84} height={60} rx={5} fill={PAL.mist} />
				<rect x={120} y={572} width={150} height={68} rx={5} fill={PAL.pale} />
				<rect x={120} y={720} width={44} height={80} rx={5} fill={PAL.mist} />
				<rect x={172} y={740} width={44} height={60} rx={5} fill={PAL.pale} />
				<rect x={224} y={708} width={44} height={92} rx={5} fill={PAL.mist} />
			</g>
			<rect x={100} y={804} width={188} height={142} rx={6} fill={`url(#${ids.dotsShelf})`} />
			<g>
				<path d="M 860 300 L 1120 300" stroke={PAL.light} strokeWidth={8} strokeLinecap="round" />
				<path d="M 930 300 L 930 340 M 1060 300 L 1060 340" stroke={PAL.light} strokeWidth={4} />
				<rect x={890} y={336} width={210} height={150} rx={10} fill={PAL.white} stroke={PAL.light} strokeWidth={4} />
				<path d="M 920 440 C 950 440 960 386 994 386 C 1030 386 1036 430 1070 430" stroke={PAL.light} strokeWidth={6} fill="none" strokeLinecap="round" />
				{[
					[920, 440],
					[994, 386],
					[1070, 430],
				].map(([cx, cy], i) => (
					<circle key={i} cx={cx} cy={cy} r={11} fill={i === 1 ? PAL.light : PAL.white} stroke={PAL.light} strokeWidth={4} />
				))}
				<rect x={914} y={354} width={70} height={9} rx={4.5} fill={PAL.pale} />
			</g>

			{/* halftone disc framing the head, and a small accent disc */}
			<circle cx={600} cy={560} r={300} fill={`url(#${ids.dots})`} />
			<circle cx={862 + drift} cy={612} r={92} fill={`url(#${ids.dotsDeep})`} />

			<g transform={`translate(0 ${breathe})`}>
				<Person x={X} y={Y} s={S} coat body={PAL.primary} wear="ghutra" armL="none" armR="none" />
				{/* the coat continues past the bottom edge */}
				<rect x={X - W / 2 + 3.6} y={Y - 5} width={W - 7.2} height={200} fill={PAL.white} />
				<path d={`M ${X - W / 2} ${Y - 6} L ${X - W / 2} ${Y + 200} M ${X + W / 2} ${Y - 6} L ${X + W / 2} ${Y + 200}`} stroke={PAL.light} strokeWidth={3 * S} />
				<path d={`M ${X} ${Y - 6} L ${X} ${Y + 200}`} stroke={PAL.light} strokeWidth={4 * S} strokeLinecap="round" />

				<Badge x={X} neckY={a.top} s={2} />

				{/* arms: the far one reaches across to steady the tablet */}
				<Sleeve pts={[[a.shoulderR.x, a.shoulderR.y], [856, 900], handR]} s={S} hand={false} />
				<Sleeve pts={[[a.shoulderL.x, a.shoulderL.y], [414, 920], handL]} s={S} hand={false} />

				{/* tablet with a case file */}
				<g transform={`translate(${TAB.cx} ${TAB.cy}) rotate(${TAB.rot})`}>
					<rect x={-TAB.w / 2 + 8} y={-TAB.h / 2 + 10} width={TAB.w} height={TAB.h} rx={20} fill={PAL.ink} opacity={0.12} />
					<rect x={-TAB.w / 2} y={-TAB.h / 2} width={TAB.w} height={TAB.h} rx={20} fill={PAL.ink} />
					<rect x={-TAB.w / 2 + 14} y={-TAB.h / 2 + 16} width={TAB.w - 28} height={TAB.h - 32} rx={9} fill={PAL.white} />
					{/* header */}
					<rect x={-TAB.w / 2 + 14} y={-TAB.h / 2 + 16} width={TAB.w - 28} height={46} rx={9} fill={PAL.primary} />
					<rect x={-TAB.w / 2 + 14} y={-TAB.h / 2 + 50} width={TAB.w - 28} height={12} fill={PAL.primary} />
					<rect x={-10} y={-TAB.h / 2 + 32} width={72} height={10} rx={5} fill={PAL.white} />
					<circle cx={-62} cy={-TAB.h / 2 + 39} r={11} fill={PAL.light} />
					{/* lines */}
					<rect x={-40} y={-50} width={110} height={9} rx={4.5} fill={PAL.light} />
					<rect x={-10} y={-30} width={80} height={9} rx={4.5} fill={PAL.light} />
					{/* small chart */}
					<path d="M -72 64 L 72 64" stroke={PAL.ink} strokeWidth={3} />
					{[0.35, 0.6, 0.45, 0.85].map((v, i) => (
						<rect key={i} x={-64 + i * 36} y={64 - v * 70} width={24} height={v * 70} rx={4} fill={i === 3 ? PAL.primary : PAL.light} />
					))}
					<rect x={-72} y={82} width={90} height={9} rx={4.5} fill={PAL.pale} />
				</g>
				<circle cx={handR[0]} cy={handR[1]} r={17 * S} fill={PAL.skin} />
				<circle cx={handL[0]} cy={handL[1]} r={17 * S} fill={PAL.skin} />
			</g>
		</Frame>
	);
};

export default Practitioner;
