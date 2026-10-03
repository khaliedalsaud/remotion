// "Skill" detail: two gloved hands practising a precise task on an abstract
// training station, seen from above. The right hand guides a slim probe onto a
// marked target along a guide path; the left hand steadies the pad. Purely a
// simulation pad with dots and lines — no patient, nothing clinical-graphic.
import {Frame, Halftone, PAL, useAmbientFrame, useIds} from './kit';

type Pt = {x: number; y: number};

const rot = (p: Pt, c: Pt, deg: number): Pt => {
	const a = (deg * Math.PI) / 180;
	const dx = p.x - c.x;
	const dy = p.y - c.y;
	return {x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a)};
};
const f = (v: number) => Math.round((v / 1200) * 1000) / 1000;

// Station geometry (station-local coordinates, rotated about ST_C).
const ST_C = {x: 600, y: 600};
const ST_ROT = -4;
const PAD = {x: 250, y: 352, w: 700, h: 496};
/** Target dots along the guide path; ACTIVE is where the probe tip rests. */
const TARGETS: Pt[] = [
	{x: 862, y: 452},
	{x: 778, y: 494},
	{x: 690, y: 526},
	{x: 600, y: 556},
	{x: 512, y: 594},
	{x: 428, y: 642},
	{x: 352, y: 690},
];
const ACTIVE = 3;
const TIP = rot(TARGETS[ACTIVE], ST_C, ST_ROT);

export const focus = {
	center: [0.5, 0.5],
	/** The probe tip on the active target dot (zoom target). */
	detail: [f(TIP.x), f(TIP.y)],
	/** Completed targets on the guide path. */
	path: [f(rot(TARGETS[1], ST_C, ST_ROT).x), f(rot(TARGETS[1], ST_C, ST_ROT).y)],
	/** The steadying left hand. */
	hand: [f(300), f(840)],
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
	hand: string;
	shade?: string;
	pen: React.ReactNode;
}> = ({x, y, angle, forearm = 36, sleeve, cuff, hand, shade, pen}) => (
	<g transform={`translate(${x} ${y}) rotate(${angle})`}>
		<g transform={`translate(236 46) rotate(${forearm})`}>
			<Capsule x1={-40} y1={0} x2={60} y2={0} w={104} fill={hand} />
			<rect x={70} y={-74} width={900} height={148} fill={sleeve} stroke={PAL.ink} strokeWidth={3} />
			<rect x={40} y={-66} width={64} height={132} rx={14} fill={cuff} stroke={PAL.ink} strokeWidth={3} />
			<line x1={62} y1={-60} x2={62} y2={60} stroke={PAL.light} strokeWidth={4} />
		</g>
		<ellipse cx={172} cy={26} rx={88} ry={64} fill={hand} stroke={PAL.ink} strokeWidth={3} transform="rotate(14 172 26)" />
		{shade ? <ellipse cx={190} cy={50} rx={60} ry={36} fill={shade} transform="rotate(14 190 50)" /> : null}
		<Capsule x1={164} y1={-26} x2={92} y2={-24} w={30} fill={hand} />
		{pen}
		<Capsule x1={176} y1={56} x2={92} y2={22} w={34} fill={hand} />
		<Capsule x1={186} y1={-4} x2={70} y2={-6} w={32} fill={hand} />
	</g>
);

/** A left hand lying flat (steadying), seen from above. Local frame: wrist at
 * the origin, fingers pointing along +x. */
const FlatHand: React.FC<{x: number; y: number; angle: number; sleeve: string; cuff: string; hand: string; shade?: string}> = ({
	x,
	y,
	angle,
	sleeve,
	cuff,
	hand,
	shade,
}) => (
	<g transform={`translate(${x} ${y}) rotate(${angle})`}>
		<rect x={-900} y={-74} width={860} height={148} fill={sleeve} stroke={PAL.ink} strokeWidth={3} />
		<rect x={-70} y={-66} width={74} height={132} rx={14} fill={cuff} stroke={PAL.ink} strokeWidth={3} />
		<line x1={-42} y1={-60} x2={-42} y2={60} stroke={PAL.light} strokeWidth={4} />
		<Capsule x1={150} y1={-46} x2={196} y2={-50} w={30} fill={hand} />
		<Capsule x1={150} y1={-16} x2={226} y2={-18} w={31} fill={hand} />
		<Capsule x1={150} y1={14} x2={220} y2={16} w={31} fill={hand} />
		<Capsule x1={140} y1={42} x2={190} y2={48} w={28} fill={hand} />
		<rect x={0} y={-62} width={168} height={124} rx={46} fill={hand} stroke={PAL.ink} strokeWidth={3} />
		{shade ? <rect x={20} y={10} width={120} height={40} rx={20} fill={shade} /> : null}
		<Capsule x1={56} y1={40} x2={132} y2={88} w={32} fill={hand} />
	</g>
);

const Probe: React.FC = () => (
	<g stroke={PAL.ink} strokeWidth={3} strokeLinejoin="round">
		<path d="M 0 0 L 50 -5 L 50 5 Z" fill={PAL.ink} />
		<rect x={46} y={-9} width={34} height={18} rx={4} fill={PAL.light} />
		<rect x={76} y={-15} width={300} height={30} rx={13} fill={PAL.deep} />
		{[96, 116, 136].map((gx) => (
			<rect key={gx} x={gx} y={-15} width={10} height={30} fill={PAL.mid} strokeWidth={2} />
		))}
		<rect x={346} y={-15} width={30} height={30} rx={11} fill={PAL.primary} />
	</g>
);

const Skill: React.FC = () => {
	const ids = useIds('dots', 'halo', 'tray', 'shade');
	const t = useAmbientFrame();
	const pulse = Math.sin(t / 30);
	const guide = TARGETS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
	const done = TARGETS.slice(0, ACTIVE + 1)
		.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
		.join(' ');
	const a = TARGETS[ACTIVE];
	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.halo} color={PAL.primary} spacing={11} r={2.2} angle={0} opacity={0.55} />
				<Halftone id={ids.tray} color={PAL.mid} spacing={12} r={2.4} opacity={0.45} />
				<Halftone id={ids.shade} color={PAL.light} spacing={9} r={2.2} />
			</defs>
			<circle cx={600} cy={560} r={500} fill={`url(#${ids.dots})`} />

			<g transform={`rotate(${ST_ROT} ${ST_C.x} ${ST_C.y})`}>
				{/* station base */}
				<rect x={150} y={250} width={900} height={700} rx={44} fill={PAL.ink} opacity={0.08} transform="translate(12 16)" />
				<rect x={150} y={250} width={900} height={700} rx={44} fill={PAL.light} stroke={PAL.ink} strokeWidth={4} />
				<rect x={176} y={880} width={848} height={44} rx={16} fill={`url(#${ids.tray})`} />
				{/* tool groove with a spare probe */}
				<rect x={330} y={274} width={540} height={46} rx={23} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
				<g transform="translate(372 297)">
					<Probe />
				</g>
				<circle cx={920} cy={297} r={18} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
				<circle cx={970} cy={297} r={18} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />

				{/* training pad: thickness, surface, grid */}
				<rect x={PAD.x} y={PAD.y + 18} width={PAD.w} height={PAD.h} rx={34} fill={PAL.mid} stroke={PAL.ink} strokeWidth={3} />
				<rect x={PAD.x} y={PAD.y} width={PAD.w} height={PAD.h} rx={34} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
				<g stroke={PAL.pale} strokeWidth={2.5}>
					{Array.from({length: 13}).map((_, i) => (
						<line key={`v${i}`} x1={PAD.x + 50 + i * 50} y1={PAD.y + 40} x2={PAD.x + 50 + i * 50} y2={PAD.y + PAD.h - 30} />
					))}
					{Array.from({length: 8}).map((_, i) => (
						<line key={`h${i}`} x1={PAD.x + 30} y1={PAD.y + 70 + i * 52} x2={PAD.x + PAD.w - 30} y2={PAD.y + 70 + i * 52} />
					))}
				</g>
				{/* ruler ticks along the top edge */}
				<g stroke={PAL.ink} strokeWidth={3} strokeLinecap="round">
					{Array.from({length: 25}).map((_, i) => (
						<line key={i} x1={PAD.x + 50 + i * 25} y1={PAD.y + 12} x2={PAD.x + 50 + i * 25} y2={PAD.y + (i % 4 === 0 ? 40 : 26)} />
					))}
				</g>

				{/* guide lane, dashed path, completed stretch */}
				<path d={guide} stroke={PAL.pale} strokeWidth={74} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<path d={guide} stroke={PAL.light} strokeWidth={5} fill="none" strokeDasharray="4 16" strokeLinecap="round" strokeLinejoin="round" />
				<path d={done} stroke={PAL.primary} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				{TARGETS.map((p, i) =>
					i < ACTIVE ? (
						<circle key={i} cx={p.x} cy={p.y} r={13} fill={PAL.primary} stroke={PAL.white} strokeWidth={4} />
					) : i > ACTIVE ? (
						<circle key={i} cx={p.x} cy={p.y} r={13} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
					) : null,
				)}

				{/* the active target */}
				<circle cx={a.x} cy={a.y} r={70 + pulse * 3} fill={`url(#${ids.halo})`} />
				<circle cx={a.x} cy={a.y} r={42} fill={PAL.white} stroke={PAL.primary} strokeWidth={3} />
				<circle cx={a.x} cy={a.y} r={26} fill={PAL.pale} stroke={PAL.primary} strokeWidth={6} />
				<circle cx={a.x} cy={a.y} r={7} fill={PAL.primary} />
				<g stroke={PAL.ink} strokeWidth={4} strokeLinecap="round">
					<line x1={a.x - 82} y1={a.y} x2={a.x - 56} y2={a.y} />
					<line x1={a.x + 56} y1={a.y} x2={a.x + 82} y2={a.y} />
					<line x1={a.x} y1={a.y - 82} x2={a.x} y2={a.y - 56} />
					<line x1={a.x} y1={a.y + 56} x2={a.x} y2={a.y + 82} />
				</g>

				{/* corner pins */}
				{[
					[PAD.x + 34, PAD.y + 34],
					[PAD.x + PAD.w - 34, PAD.y + 34],
					[PAD.x + 34, PAD.y + PAD.h - 34],
					[PAD.x + PAD.w - 34, PAD.y + PAD.h - 34],
				].map(([cx, cy], i) => (
					<g key={i}>
						<circle cx={cx} cy={cy} r={14} fill={PAL.deep} stroke={PAL.ink} strokeWidth={3} />
						<circle cx={cx} cy={cy} r={5} fill={PAL.white} />
					</g>
				))}
			</g>

			{/* left hand steadies the pad */}
			<FlatHand x={196} y={906} angle={-26} sleeve={PAL.deep} cuff={PAL.pale} hand={PAL.pale} shade={`url(#${ids.shade})`} />
			{/* right hand guides the probe onto the target */}
			<PenHand
				x={TIP.x}
				y={TIP.y}
				angle={40}
				forearm={30}
				sleeve={PAL.deep}
				cuff={PAL.pale}
				hand={PAL.pale}
				shade={`url(#${ids.shade})`}
				pen={<Probe />}
			/>
		</Frame>
	);
};

export default Skill;
