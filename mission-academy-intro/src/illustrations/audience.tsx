// "حضور" — the audience, seen from behind: three rows of seated attendees
// (mixed headwear and colours) in dark theatre seats, backlit by a bright
// stage screen. In the middle row one attendee raises a hand to ask a
// question; an empty seat in the row ahead lets the hand read against the
// glow.
import {Frame, Halftone, Person, PAL, personAnchors, useAmbientFrame, useIds} from './kit';
import type {Wear} from './kit';

type Pt = readonly [number, number];

type Seat = {x: number; wear?: Wear; body?: string; wearColor?: string};
type Row = {y: number; s: number; seats: Seat[]};

const ROWS: Row[] = [
	{
		y: 592,
		s: 0.56,
		seats: [
			{x: 10, wear: 'hijab', body: PAL.deep, wearColor: PAL.ink},
			{x: 114, wear: 'none', body: PAL.primary},
			{x: 218, wear: 'hijab', body: PAL.primary, wearColor: PAL.deep},
			{x: 322, wear: 'ghutra', body: PAL.deep},
			{x: 426, wear: 'hijab', body: PAL.primary, wearColor: PAL.ink},
			{x: 530, wear: 'none', body: PAL.deep},
			{x: 634},
			{x: 738},
			{x: 842, wear: 'none', body: PAL.primary},
			{x: 946, wear: 'hijab', body: PAL.deep, wearColor: PAL.mid},
			{x: 1050, wear: 'ghutra', body: PAL.primary},
			{x: 1154, wear: 'none', body: PAL.deep},
		],
	},
	{
		y: 792,
		s: 0.82,
		seats: [
			{x: 50, wear: 'ghutra', body: PAL.primary},
			{x: 200, wear: 'hijab', body: PAL.deep, wearColor: PAL.mid},
			{x: 350, wear: 'none', body: PAL.primary},
			{x: 500, wear: 'ghutra', body: PAL.primary},
			{x: 650, wear: 'hijab', body: PAL.deep, wearColor: PAL.ink},
			{x: 800, wear: 'ghutra', body: PAL.deep},
			{x: 950, wear: 'hijab', body: PAL.primary, wearColor: PAL.ink},
			{x: 1100, wear: 'none', body: PAL.deep},
		],
	},
	{
		y: 1132,
		s: 1.22,
		seats: [
			{x: 110, wear: 'hijab', body: PAL.primary, wearColor: PAL.deep},
			{x: 345, wear: 'ghutra', body: PAL.deep},
			{x: 580, wear: 'none', body: PAL.mid},
			{x: 815, wear: 'hijab', body: PAL.deep, wearColor: PAL.ink},
			{x: 1050, wear: 'ghutra', body: PAL.primary},
		],
	},
];

/** The attendee asking a question: middle row, seat index 4. */
const ASK = {row: 1, seat: 4};
const asker = ROWS[ASK.row].seats[ASK.seat];
const askA = personAnchors(asker.x, ROWS[ASK.row].y, ROWS[ASK.row].s);
const HAND: Pt = [askA.shoulderR.x + 24, 498];

export const focus = {
	center: [0.5, 0.5],
	/** The raised hand. */
	hand: [HAND[0] / 1200, HAND[1] / 1200],
	/** The person asking. */
	asker: [asker.x / 1200, askA.head.y / 1200],
	/** The glowing stage screen. */
	screen: [0.5, 0.25],
} as const;

/** Small, deterministic lean (deg) and height (px) variations per attendee. */
const jitter = (ri: number, i: number): [number, number] => [(((i * 37 + ri * 11) % 7) - 3) * 0.9, (((i * 53 + ri * 7) % 5) - 2) * 3];

/** A row of theatre seat backs in front of seated attendees. */
const SeatBacks: React.FC<{row: Row; spacing: number}> = ({row, spacing}) => {
	const {y, s, seats} = row;
	const top = y - 64 * s;
	return (
		<g>
			{seats.map((seat, i) => (
				<g key={i}>
					<rect x={seat.x - spacing / 2 + 4 * s} y={top} width={spacing - 8 * s} height={110 * s} rx={20 * s} fill={PAL.mid} stroke={PAL.deep} strokeWidth={3} />
					<rect x={seat.x - spacing / 2 + 22 * s} y={top + 12 * s} width={spacing - 44 * s} height={7 * s} rx={3.5 * s} fill={PAL.light} />
				</g>
			))}
		</g>
	);
};

const Audience: React.FC = () => {
	const ids = useIds('dots', 'glow', 'screenDots', 'handDots');
	const t = useAmbientFrame();
	const wave = Math.sin(t / 22) * 1.5;
	const pulse = 0.5 + Math.sin(t / 30) * 0.5;
	const spacing = [104, 150, 235];
	const sh = askA.shoulderR;
	const elbow: Pt = [sh.x + 30, askA.top - 46];

	return (
		<Frame bg={PAL.light}>
			<defs>
				<Halftone id={ids.dots} color={PAL.mid} spacing={18} r={4} opacity={0.6} />
				<Halftone id={ids.screenDots} color={PAL.light} spacing={12} r={2.4} />
				<Halftone id={ids.handDots} color={PAL.primary} spacing={11} r={2.4} opacity={0.55} />
				<radialGradient id={ids.glow} cx={600} cy={300} r={720} gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor={PAL.white} />
					<stop offset="0.38" stopColor={PAL.white} />
					<stop offset="0.7" stopColor={PAL.pale} />
					<stop offset="1" stopColor={PAL.light} stopOpacity={0} />
				</radialGradient>
			</defs>

			{/* hall, halftone halo, and the glow of the stage */}
			<circle cx={600} cy={330} r={560} fill={`url(#${ids.dots})`} />
			<rect x={0} y={0} width={1200} height={1200} fill={`url(#${ids.glow})`} />

			{/* stage + screen */}
			<rect x={0} y={446} width={1200} height={20} fill={PAL.pale} />
			<line x1={0} y1={446} x2={1200} y2={446} stroke={PAL.light} strokeWidth={4} />
			<rect x={322} y={186} width={556} height={226} rx={12} fill={PAL.white} stroke={PAL.light} strokeWidth={6} />
			<rect x={352} y={214} width={180} height={170} rx={6} fill={`url(#${ids.screenDots})`} />
			<path d="M 572 330 C 640 330 650 262 720 262 C 790 262 790 330 850 330" stroke={PAL.light} strokeWidth={8} fill="none" strokeLinecap="round" />
			{[
				[572, 330],
				[720, 262],
				[850, 330],
			].map(([cx, cy], i) => (
				<circle key={i} cx={cx} cy={cy} r={16} fill={PAL.white} stroke={PAL.light} strokeWidth={6} />
			))}
			<rect x={572} y={222} width={130} height={12} rx={5} fill={PAL.pale} />

			{ROWS.map((row, ri) => (
				<g key={ri}>
					{row.seats.map((seat, i) =>
						seat.wear ? (
							<g key={i} transform={ri === ASK.row && i === ASK.seat ? undefined : `translate(0 ${jitter(ri, i)[1]}) rotate(${jitter(ri, i)[0]} ${seat.x} ${row.y})`}>
								<Person
									x={seat.x}
									y={row.y}
									s={row.s}
									back
									body={seat.body}
									wear={seat.wear}
									wearColor={seat.wearColor}
									armL="none"
									armR="none"
								/>
								{seat.wear === 'none' ? (
									<circle cx={seat.x} cy={personAnchors(seat.x, row.y, row.s).head.y - 1.5 * row.s} r={36 * 1.02 * row.s} fill={PAL.ink} />
								) : null}
							</g>
						) : null,
					)}
					{ri === ASK.row ? (
						<circle cx={HAND[0]} cy={HAND[1] - 6} r={78} fill={`url(#${ids.handDots})`} />
					) : null}
					{ri === ASK.row ? (
						<g transform={`rotate(${wave} ${sh.x} ${sh.y})`}>
							<path
								d={`M ${sh.x} ${sh.y} L ${elbow[0]} ${elbow[1]} L ${HAND[0]} ${HAND[1]}`}
								stroke={PAL.ink}
								strokeWidth={44}
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d={`M ${sh.x} ${sh.y} L ${elbow[0]} ${elbow[1]} L ${HAND[0]} ${HAND[1]}`}
								stroke={PAL.deep}
								strokeWidth={36}
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<circle cx={HAND[0]} cy={HAND[1]} r={21} fill={PAL.skin} stroke={PAL.deep} strokeWidth={3} />
							<g stroke={PAL.primary} strokeWidth={7} strokeLinecap="round" opacity={0.6 + pulse * 0.4}>
								<line x1={HAND[0] - 42} y1={HAND[1] - 26} x2={HAND[0] - 64} y2={HAND[1] - 44} />
								<line x1={HAND[0]} y1={HAND[1] - 44} x2={HAND[0]} y2={HAND[1] - 72} />
								<line x1={HAND[0] + 42} y1={HAND[1] - 26} x2={HAND[0] + 64} y2={HAND[1] - 44} />
							</g>
						</g>
					) : null}
					<SeatBacks row={row} spacing={spacing[ri]} />
				</g>
			))}
		</Frame>
	);
};

export default Audience;
