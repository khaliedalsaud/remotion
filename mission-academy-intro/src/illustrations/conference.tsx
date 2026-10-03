// "المؤتمرات والفعاليات" — a conference stage. A clinician in coat and ghutra
// speaks beside the lectern, gesturing to a large screen (bar chart + share
// ring); a panelist waits in an armchair. Soft white light cones fall from
// the truss, and the foreground row of the audience is seen from behind.
// Composed for a wide crop (visible y ≈ 218–982) as well as the square.
import {Badge, Board, Chart, Frame, Halftone, Person, PAL, personAnchors, useAmbientFrame, useIds} from './kit';
import type {Wear} from './kit';

const FLOOR = 792; // where the backdrop meets the stage floor
const EDGE = 884; // front edge of the stage

const SPK = {x: 336, y: 622, s: 1}; // speaker (feet at y + 190)
const PNL = {x: 940, y: 762, s: 0.86}; // seated panelist
const SCREEN = {x: 430, y: 252, w: 540, h: 336};

type Head = {x: number; y: number; s: number; wear: Wear; body: string; wearColor?: string};
const AUDIENCE: Head[] = [
	{x: 60, y: 1196, s: 1.2, wear: 'hijab', body: PAL.deep, wearColor: PAL.mid},
	{x: 290, y: 1214, s: 1.12, wear: 'ghutra', body: PAL.primary},
	{x: 530, y: 1224, s: 1.24, wear: 'hijab', body: PAL.mid, wearColor: PAL.ink},
	{x: 770, y: 1206, s: 1.12, wear: 'hijab', body: PAL.primary, wearColor: PAL.light},
	{x: 1010, y: 1212, s: 1.2, wear: 'ghutra', body: PAL.deep},
	{x: 1220, y: 1200, s: 1.16, wear: 'none', body: PAL.primary},
];

export const focus = {
	center: [0.5, 0.5],
	/** The speaker's head and gesturing hand. */
	speaker: [0.3, 0.38],
	/** The presentation screen. */
	screen: [0.583, 0.35],
	/** The foreground row of the audience. */
	audience: [0.47, 0.78],
	/** The seated panelist. */
	panelist: [0.78, 0.55],
} as const;

/** Short hair seen from behind: covers the whole head so it never reads as a face. */
const BackHair: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => {
	const {head, r} = personAnchors(x, y, s);
	return <circle cx={head.x} cy={head.y - r * 0.04} r={r * 1.02} fill={PAL.ink} />;
};

/** A spotlight hanging from the truss, aimed down. */
const Lamp: React.FC<{x: number; tilt?: number}> = ({x, tilt = 0}) => (
	<g transform={`rotate(${tilt} ${x} 170)`}>
		<line x1={x} y1={158} x2={x} y2={176} stroke={PAL.ink} strokeWidth={6} />
		<path d={`M ${x - 22} 172 L ${x + 22} 172 L ${x + 28} 214 L ${x - 28} 214 Z`} fill={PAL.ink} stroke={PAL.inkSoft} strokeWidth={3} strokeLinejoin="round" />
		<ellipse cx={x} cy={214} rx={26} ry={6} fill={PAL.white} />
	</g>
);

const Conference: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep', 'dotsWhite', 'stage');
	const t = useAmbientFrame();
	const gesture = Math.sin(t / 36) * 1.4;
	const glow = 0.085 + Math.sin(t / 50) * 0.01;
	const spk = personAnchors(SPK.x, SPK.y, SPK.s);
	const pnl = personAnchors(PNL.x, PNL.y, PNL.s);
	const feet = SPK.y + 190 * SPK.s;

	return (
		<Frame bg={PAL.deep}>
			<defs>
				<Halftone id={ids.dots} color={PAL.primary} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={12} r={2.4} opacity={0.5} />
				<Halftone id={ids.dotsWhite} color={PAL.white} spacing={14} r={2.2} opacity={0.35} />
				<linearGradient id={ids.stage} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={PAL.mid} />
					<stop offset="1" stopColor={PAL.primary} />
				</linearGradient>
			</defs>

			{/* backdrop: halftone halo and the event's thread motif */}
			<circle cx={700} cy={430} r={440} fill={`url(#${ids.dots})`} />
			<path d="M -20 700 C 220 700 260 330 520 330 S 860 640 1220 560" stroke={PAL.primary} strokeWidth={10} fill="none" strokeLinecap="round" />
			{[
				[160, 646],
				[1100, 588],
			].map(([cx, cy], i) => (
				<circle key={i} cx={cx} cy={cy} r={16} fill={PAL.deep} stroke={PAL.primary} strokeWidth={8} />
			))}

			{/* roll-up banner: abstract event identity */}
			<g>
				<rect x={28} y={372} width={104} height={420} fill={PAL.white} stroke={PAL.ink} strokeWidth={4} />
				<rect x={28} y={372} width={104} height={150} fill={PAL.primary} />
				<rect x={28} y={372} width={104} height={150} fill={`url(#${ids.dotsWhite})`} />
				<path d="M 44 470 C 70 470 74 420 100 420 L 116 420" stroke={PAL.white} strokeWidth={6} fill="none" strokeLinecap="round" />
				<circle cx={100} cy={420} r={9} fill={PAL.white} />
				<rect x={46} y={548} width={68} height={10} rx={5} fill={PAL.deep} />
				<rect x={46} y={572} width={52} height={7} rx={3.5} fill={PAL.light} />
				<rect x={46} y={590} width={60} height={7} rx={3.5} fill={PAL.light} />
				<rect x={20} y={786} width={120} height={14} rx={5} fill={PAL.ink} />
			</g>

			{/* truss + spotlights */}
			<rect x={-10} y={140} width={1220} height={20} fill={PAL.ink} />
			<path
				d={Array.from({length: 31})
					.map((_, i) => `M ${i * 40} 142 L ${i * 40 + 40} 158`)
					.join(' ')}
				stroke={PAL.inkSoft}
				strokeWidth={3}
			/>
			<rect x={-10} y={120} width={1220} height={8} fill={PAL.ink} />

			{/* stage floor */}
			<rect x={0} y={FLOOR} width={1200} height={EDGE - FLOOR} fill={`url(#${ids.stage})`} />
			<line x1={0} y1={FLOOR} x2={1200} y2={FLOOR} stroke={PAL.ink} strokeWidth={4} />
			<rect x={0} y={EDGE} width={1200} height={90} fill={PAL.primary} />
			<rect x={0} y={EDGE} width={1200} height={90} fill={`url(#${ids.dotsDeep})`} />
			<line x1={0} y1={EDGE} x2={1200} y2={EDGE} stroke={PAL.ink} strokeWidth={4} />
			<rect x={0} y={EDGE + 90} width={1200} height={400} fill={PAL.ink} />

			{/* screen, glowing */}
			<rect x={SCREEN.x - 24} y={SCREEN.y - 24} width={SCREEN.w + 48} height={SCREEN.h + 48} rx={20} fill={PAL.white} opacity={glow} />
			<Board x={SCREEN.x} y={SCREEN.y} w={SCREEN.w} h={SCREEN.h}>
				<rect x={SCREEN.x + 36} y={SCREEN.y + 34} width={170} height={16} rx={5} fill={PAL.deep} />
				<rect x={SCREEN.x + 36} y={SCREEN.y + 62} width={110} height={8} rx={4} fill={PAL.light} />
				<Chart x={SCREEN.x + 40} y={SCREEN.y + 112} w={260} h={180} values={[0.34, 0.5, 0.44, 0.7, 0.92]} accent={4} />
				<path
					d={`M ${SCREEN.x + 70} ${SCREEN.y + 236} L ${SCREEN.x + 122} ${SCREEN.y + 206} L ${SCREEN.x + 174} ${SCREEN.y + 214} L ${SCREEN.x + 226} ${SCREEN.y + 160} L ${SCREEN.x + 274} ${SCREEN.y + 122}`}
					stroke={PAL.deep}
					strokeWidth={5}
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				{[
					[70, 236],
					[122, 206],
					[174, 214],
					[226, 160],
					[274, 122],
				].map(([dx, dy], i) => (
					<circle key={i} cx={SCREEN.x + dx} cy={SCREEN.y + dy} r={7} fill={PAL.white} stroke={PAL.deep} strokeWidth={4} />
				))}
				{/* share ring */}
				<g transform={`rotate(-90 ${SCREEN.x + 410} ${SCREEN.y + 150})`}>
					<circle cx={SCREEN.x + 410} cy={SCREEN.y + 150} r={70} fill="none" stroke={PAL.pale} strokeWidth={30} />
					<circle cx={SCREEN.x + 410} cy={SCREEN.y + 150} r={70} fill="none" stroke={PAL.primary} strokeWidth={30} strokeDasharray={`${2 * Math.PI * 70 * 0.62} 999`} />
					<circle
						cx={SCREEN.x + 410}
						cy={SCREEN.y + 150}
						r={70}
						fill="none"
						stroke={PAL.light}
						strokeWidth={30}
						strokeDasharray={`0 ${2 * Math.PI * 70 * 0.64} ${2 * Math.PI * 70 * 0.2} 999`}
					/>
				</g>
				<rect x={SCREEN.x + 352} y={SCREEN.y + 250} width={14} height={14} rx={3} fill={PAL.primary} />
				<rect x={SCREEN.x + 376} y={SCREEN.y + 253} width={100} height={8} rx={4} fill={PAL.light} />
				<rect x={SCREEN.x + 352} y={SCREEN.y + 278} width={14} height={14} rx={3} fill={PAL.light} />
				<rect x={SCREEN.x + 376} y={SCREEN.y + 281} width={70} height={8} rx={4} fill={PAL.light} />
			</Board>

			{/* light cones from the truss */}
			<path d={`M ${SPK.x - 26} 214 L ${SPK.x + 26} 214 L ${SPK.x + 190} ${feet + 6} L ${SPK.x - 190} ${feet + 6} Z`} fill={PAL.white} opacity={0.09} />
			<path d={`M ${PNL.x - 26} 214 L ${PNL.x + 26} 214 L ${PNL.x + 170} 846 L ${PNL.x - 170} 846 Z`} fill={PAL.white} opacity={0.07} />
			<ellipse cx={SPK.x} cy={feet + 4} rx={190} ry={30} fill={PAL.white} opacity={0.28} />
			<ellipse cx={PNL.x} cy={846} rx={170} ry={26} fill={PAL.white} opacity={0.22} />
			<Lamp x={SPK.x} />
			<Lamp x={PNL.x} />
			<Lamp x={640} tilt={-8} />

			{/* panelist in an armchair, side table with water */}
			<g>
				<rect x={PNL.x - 96} y={pnl.top - 30} width={192} height={230} rx={40} fill={PAL.light} stroke={PAL.ink} strokeWidth={4} />
				<g stroke={PAL.ink} strokeWidth={7} strokeLinecap="round">
					<line x1={PNL.x - 80} y1={PNL.y + 60} x2={PNL.x - 88} y2={840} />
					<line x1={PNL.x + 80} y1={PNL.y + 60} x2={PNL.x + 88} y2={840} />
				</g>
				<rect x={PNL.x - 44} y={PNL.y + 10} width={36} height={78} rx={16} fill={PAL.ink} />
				<rect x={PNL.x + 8} y={PNL.y + 10} width={36} height={78} rx={16} fill={PAL.ink} />
				<rect x={PNL.x - 90} y={PNL.y - 6} width={180} height={40} rx={14} fill={PAL.pale} stroke={PAL.ink} strokeWidth={4} />
				<Person x={PNL.x} y={PNL.y} s={PNL.s} body={PAL.mid} wear="hijab" wearColor={PAL.ink} armL="rest" armR="rest" />
				<rect x={PNL.x - 128} y={PNL.y - 74} width={46} height={110} rx={18} fill={PAL.pale} stroke={PAL.ink} strokeWidth={4} />
				<rect x={PNL.x + 82} y={PNL.y - 74} width={46} height={110} rx={18} fill={PAL.pale} stroke={PAL.ink} strokeWidth={4} />
				<rect x={PNL.x - 22} y={PNL.y - 58} width={44} height={30} rx={4} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} transform={`rotate(-8 ${PNL.x} ${PNL.y - 44})`} />
			</g>
			<g>
				<line x1={770} y1={740} x2={770} y2={840} stroke={PAL.ink} strokeWidth={8} />
				<ellipse cx={770} cy={842} rx={30} ry={7} fill={PAL.ink} />
				<ellipse cx={770} cy={738} rx={52} ry={12} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
				<path d="M 752 690 L 772 690 L 770 732 L 754 732 Z" fill={PAL.white} stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round" />
				<rect x={755} y={708} width={14} height={20} fill={PAL.light} />
			</g>

			{/* lectern */}
			<g>
				<path d="M 150 598 L 270 598 L 252 806 L 168 806 Z" fill={PAL.white} stroke={PAL.ink} strokeWidth={4} strokeLinejoin="round" />
				<path d="M 166 630 L 254 630 L 246 742 L 174 742 Z" fill={PAL.primary} />
				<path d="M 166 630 L 254 630 L 246 742 L 174 742 Z" fill={`url(#${ids.dotsWhite})`} />
				<path d="M 180 712 C 200 712 204 664 226 664 L 240 664" stroke={PAL.white} strokeWidth={6} fill="none" strokeLinecap="round" />
				<path d="M 140 588 L 280 588 L 272 606 L 148 606 Z" fill={PAL.light} stroke={PAL.ink} strokeWidth={4} strokeLinejoin="round" />
				<rect x={156} y={806} width={108} height={12} rx={4} fill={PAL.ink} />
				<path d="M 176 590 C 172 546 188 512 214 488" stroke={PAL.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
				<rect x={210} y={464} width={16} height={30} rx={8} fill={PAL.ink} transform="rotate(48 218 479)" />
			</g>

			{/* speaker: coat, ghutra, conference badge; hand on the lectern, the other toward the screen */}
			<g>
				<Person x={SPK.x} y={SPK.y} s={SPK.s} coat body={PAL.primary} wear="ghutra" armL="down" armR="none" legs />
				<g transform={`rotate(${gesture} ${spk.shoulderR.x} ${spk.shoulderR.y})`}>
					<path
						d={`M ${spk.shoulderR.x} ${spk.shoulderR.y} L ${spk.shoulderR.x + 60} ${spk.top + 102} L ${spk.shoulderR.x + 124} ${spk.top + 50}`}
						stroke={PAL.light}
						strokeWidth={40}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d={`M ${spk.shoulderR.x} ${spk.shoulderR.y} L ${spk.shoulderR.x + 60} ${spk.top + 102} L ${spk.shoulderR.x + 124} ${spk.top + 50}`}
						stroke={PAL.white}
						strokeWidth={34}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<circle cx={spk.shoulderR.x + 124} cy={spk.top + 50} r={17} fill={PAL.skin} />
				</g>
				<Badge x={SPK.x} neckY={spk.top} s={SPK.s} />
			</g>

			{/* audience, seen from behind */}
			{AUDIENCE.map((a, i) => (
				<g key={i}>
					<Person x={a.x} y={a.y} s={a.s} back body={a.body} wear={a.wear} wearColor={a.wearColor} armL="none" armR="none" />
					{a.wear === 'none' ? <BackHair x={a.x} y={a.y} s={a.s} /> : null}
				</g>
			))}
		</Frame>
	);
};

export default Conference;
