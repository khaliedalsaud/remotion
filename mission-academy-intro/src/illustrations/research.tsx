// "Scientific research": a researcher in a clinical coat examines data on a
// monitor, holding a lens over one bar of the chart (the lens shows that bar
// magnified). Papers are stacked on the desk; a colleague in the foreground,
// seen from behind, studies the same screen.
import {Badge, Chart, Doc, Frame, Halftone, Person, PAL, personAnchors, Table, useAmbientFrame, useIds} from './kit';

const f = (v: number) => Math.round((v / 1200) * 1000) / 1000;

// Monitor and screen.
const MON = {x: 500, y: 250, w: 520, h: 352};
const SCR = {x: MON.x + 18, y: MON.y + 18, w: MON.w - 36, h: MON.h - 36};
// Chart on the screen (kit Chart geometry is reproduced to place the lens).
const CH = {x: 608, y: 368, w: 372, h: 190};
const VALUES = [0.34, 0.52, 0.44, 0.8, 0.6, 0.7];
const ACCENT = 3;
const BW = (CH.w * 0.7) / VALUES.length;
const GAP = (CH.w * 0.3) / (VALUES.length + 1);
const barCx = (i: number) => CH.x + GAP + i * (BW + GAP) + BW / 2;
const barTop = (i: number) => CH.y + CH.h - VALUES[i] * CH.h;
const LINE_Y = (i: number) => barTop(i) - 30;
// The lens sits over the accent bar's top.
const LENS = {x: barCx(ACCENT), y: LINE_Y(ACCENT) + 24, r: 86};
const ZOOM = 1.6;

// Researcher (behind the desk, left of the monitor).
const R = {x: 392, y: 770, s: 1.3};
const RA = personAnchors(R.x, R.y, R.s);
/** Pointing-hand position of Person's armR="point" pose (see kit armPoints). */
const HAND = {x: R.x + RA.W / 2 + 128 * R.s, y: RA.top + 18 * R.s};

export const focus = {
	center: [0.5, 0.5],
	/** The magnified chart bar under the lens. */
	chart: [f(LENS.x), f(LENS.y)],
	/** The researcher's head. */
	researcher: [f(RA.head.x), f(RA.head.y)],
	/** Stacked papers on the desk. */
	papers: [f(262), f(774)],
} as const;

const ScreenChart: React.FC = () => (
	<g>
		<Chart x={CH.x} y={CH.y} w={CH.w} h={CH.h} values={VALUES} accent={ACCENT} />
		<path
			d={VALUES.map((_, i) => `${i === 0 ? 'M' : 'L'} ${barCx(i)} ${LINE_Y(i)}`).join(' ')}
			stroke={PAL.deep}
			strokeWidth={5}
			fill="none"
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
		{VALUES.map((_, i) => (
			<circle
				key={i}
				cx={barCx(i)}
				cy={LINE_Y(i)}
				r={i === ACCENT ? 10 : 7}
				fill={i === ACCENT ? PAL.primary : PAL.white}
				stroke={i === ACCENT ? PAL.deep : PAL.deep}
				strokeWidth={4}
			/>
		))}
	</g>
);

const Research: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep', 'lens');
	const t = useAmbientFrame();
	const sway = Math.sin(t / 40) * 0.8;
	const handleAngle = Math.atan2(HAND.y - LENS.y, HAND.x - LENS.x);
	const rim = {x: LENS.x + Math.cos(handleAngle) * LENS.r, y: LENS.y + Math.sin(handleAngle) * LENS.r};
	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={14} r={2.6} opacity={0.55} />
				<clipPath id={ids.lens}>
					<circle cx={LENS.x} cy={LENS.y} r={LENS.r} />
				</clipPath>
			</defs>
			<circle cx={680} cy={470} r={440} fill={`url(#${ids.dots})`} />
			<rect x={0} y={900} width={1200} height={300} fill={PAL.pale} />

			{/* monitor */}
			<rect x={MON.x} y={MON.y} width={MON.w} height={MON.h} rx={14} fill={PAL.ink} />
			<rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={6} fill={PAL.white} />
			<rect x={830} y={SCR.y + 26} width={150} height={16} rx={5} fill={PAL.deep} />
			<rect x={608} y={SCR.y + 26} width={16} height={16} rx={3} fill={PAL.primary} />
			<rect x={632} y={SCR.y + 30} width={70} height={8} rx={4} fill={PAL.light} />
			{/* side list of records */}
			{[0, 1, 2, 3, 4].map((i) => (
				<g key={i}>
					<rect x={540} y={SCR.y + 72 + i * 44} width={44} height={30} rx={5} fill={i === 3 ? PAL.primary : PAL.pale} />
				</g>
			))}
			<ScreenChart />

			{/* lens over the accent bar: handle, magnified view, rim */}
			<g transform={`rotate(${sway} ${HAND.x} ${HAND.y})`}>
				<line x1={rim.x} y1={rim.y} x2={HAND.x} y2={HAND.y} stroke={PAL.ink} strokeWidth={30} strokeLinecap="round" />
				<line x1={rim.x} y1={rim.y} x2={HAND.x} y2={HAND.y} stroke={PAL.deep} strokeWidth={24} strokeLinecap="round" />
				<g clipPath={`url(#${ids.lens})`}>
					<circle cx={LENS.x} cy={LENS.y} r={LENS.r} fill={PAL.white} />
					<g transform={`translate(${LENS.x} ${LENS.y}) scale(${ZOOM}) translate(${-LENS.x} ${-LENS.y})`}>
						<ScreenChart />
					</g>
					<path
						d={`M ${LENS.x - LENS.r * 0.74} ${LENS.y - LENS.r * 0.24} A ${LENS.r * 0.78} ${LENS.r * 0.78} 0 0 1 ${LENS.x - LENS.r * 0.3} ${LENS.y - LENS.r * 0.72}`}
						stroke={PAL.white}
						strokeWidth={7}
						fill="none"
						strokeLinecap="round"
					/>
				</g>
				<circle cx={LENS.x} cy={LENS.y} r={LENS.r} fill="none" stroke={PAL.ink} strokeWidth={14} />
				<circle cx={LENS.x} cy={LENS.y} r={LENS.r - 9} fill="none" stroke={PAL.light} strokeWidth={4} />
			</g>

			{/* researcher */}
			<Person x={R.x} y={R.y} s={R.s} coat body={PAL.primary} wear="ghutra" armR="point" armL="down" />
			<Badge x={R.x} neckY={RA.top} s={R.s} />

			{/* desk and papers */}
			<rect x={1016} y={840} width={26} height={170} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
			<g stroke={PAL.ink} strokeWidth={3}>
				<rect x={166} y={840} width={190} height={170} fill={PAL.white} />
				<line x1={166} y1={896} x2={356} y2={896} />
				<line x1={166} y1={952} x2={356} y2={952} />
			</g>
			<rect x={238} y={864} width={46} height={10} rx={5} fill={PAL.light} />
			<rect x={238} y={920} width={46} height={10} rx={5} fill={PAL.light} />
			<rect x={238} y={976} width={46} height={10} rx={5} fill={PAL.light} />
			<rect x={166} y={844} width={190} height={14} fill={`url(#${ids.dotsDeep})`} />
			<Table x={130} y={736} w={940} depth={92} />
			<rect x={738} y={MON.y + MON.h} width={44} height={158} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
			<rect x={690} y={752} width={140} height={20} rx={8} fill={PAL.light} stroke={PAL.ink} strokeWidth={3} />
			<Doc x={196} y={772} w={150} h={58} rotate={-4} lines={2} heading={false} />
			<Doc x={190} y={762} w={150} h={58} rotate={2} lines={2} heading={false} />
			<Doc x={198} y={750} w={150} h={58} rotate={-2} lines={2} mark={0} heading={false} />

			{/* colleague in the foreground, seen from behind */}
			<Person x={1000} y={1212} s={1.42} back body={PAL.deep} wear="hijab" wearColor={PAL.mid} armL="none" armR="none" />
		</Frame>
	);
};

export default Research;
