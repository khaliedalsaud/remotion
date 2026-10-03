// "طبّق" — hands-on practice. A trainee in a clinical coat works a skills
// station (a soft training pad with marked target points) with a ball-tipped
// probe; a coach beside her points to the next target, clipboard in hand.
// Abstract simulation equipment only — no patient, no medical clip-art.
import {Badge, Frame, Halftone, Person, PAL, personAnchors, Table, useAmbientFrame, useIds} from './kit';

type Pt = readonly [number, number];

/** Arm in the kit's style through custom joints (shoulder → elbow → hand). */
const Limb: React.FC<{pts: Pt[]; s: number; color: string; coat?: boolean; edge?: string; hand?: boolean}> = ({
	pts,
	s,
	color,
	coat = false,
	edge,
	hand = true,
}) => {
	const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
	const [hx, hy] = pts[pts.length - 1];
	const outline = coat ? PAL.light : edge;
	return (
		<g>
			{outline ? (
				<path d={d} stroke={outline} strokeWidth={(coat ? 40 : 39) * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			) : null}
			<path d={d} stroke={coat ? PAL.white : color} strokeWidth={34 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			{hand ? <circle cx={hx} cy={hy} r={17 * s} fill={PAL.skin} /> : null}
		</g>
	);
};

// Trainee (behind the station), coach (behind the bench, to the right).
const TR = {x: 470, y: 840, s: 1.4};
const CO = {x: 905, y: 905, s: 1.3};

// Target points on the pad (ellipses: the pad is seen from slightly above).
const TARGETS: Pt[] = [
	[456, 856],
	[556, 830],
	[664, 852],
];
const ACTIVE = 1;
const NEXT = 2;

export const focus = {
	center: [0.53, 0.6],
	/** The trainee's hands and probe on the training pad. */
	hands: [0.47, 0.675],
	/** The coach (head and gesturing arm). */
	coach: [0.73, 0.57],
} as const;

const Practice: React.FC = () => {
	const ids = useIds('dots', 'dotsPad', 'dotsDeep');
	const t = useAmbientFrame();
	const tr = personAnchors(TR.x, TR.y, TR.s);
	const co = personAnchors(CO.x, CO.y, CO.s);
	// The coach's guiding hand bobs a little.
	const bob = Math.sin(t / 30) * 3;
	const coachHand: Pt = [716, 768 + bob];

	const tip = TARGETS[ACTIVE];
	const probeHand: Pt = [604, 778];
	const probeAngle = (Math.atan2(probeHand[1] - (tip[1] - 4), probeHand[0] - tip[0]) * 180) / Math.PI;

	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsPad} color={PAL.light} spacing={12} r={2.6} angle={45} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={12} r={2.4} opacity={0.5} />
			</defs>

			{/* backdrop */}
			<circle cx={580} cy={560} r={420} fill={`url(#${ids.dots})`} />

			{/* procedure card on the wall: three steps, two done, one current */}
			<g>
				<rect x={176} y={276} width={226} height={176} rx={10} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
				<rect x={262} y={298} width={118} height={12} rx={4} fill={PAL.deep} />
				<path d="M 214 342 L 214 420" stroke={PAL.light} strokeWidth={5} />
				{[0, 1, 2].map((i) => {
					const y = 342 + i * 39;
					return (
						<g key={i}>
							<circle cx={214} cy={y} r={11} fill={i < 2 ? PAL.primary : PAL.white} stroke={PAL.primary} strokeWidth={4} />
							<rect x={244} y={y - 4} width={i === 1 ? 110 : 136} height={8} rx={4} fill={i === 2 ? PAL.primary : PAL.light} />
						</g>
					);
				})}
			</g>

			{/* coach: hijab, badge-less, clipboard in the far hand */}
			<Person x={CO.x} y={CO.y} s={CO.s} body={PAL.deep} wear="hijab" wearColor={PAL.mid} armL="none" armR="none" />
			<Limb pts={[[co.shoulderR.x, co.shoulderR.y], [1016, 820], [946, 834]]} s={CO.s} color={PAL.deep} edge={PAL.ink} hand={false} />
			<g transform="rotate(7 976 790)">
				<rect x={926} y={720} width={102} height={136} rx={8} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
				<rect x={952} y={710} width={50} height={18} rx={5} fill={PAL.ink} />
				{[0, 1, 2].map((i) => (
					<g key={i}>
						<circle cx={946} cy={756 + i * 30} r={7} fill={i < 2 ? PAL.primary : PAL.white} stroke={PAL.primary} strokeWidth={3} />
						<rect x={960} y={752 + i * 30} width={52} height={7} rx={3.5} fill={PAL.light} />
					</g>
				))}
			</g>
			<circle cx={946} cy={834} r={17 * CO.s} fill={PAL.skin} />

			{/* trainee */}
			<Person x={TR.x} y={TR.y} s={TR.s} coat body={PAL.primary} wear="none" armL="none" armR="none" />
			<Badge x={TR.x} neckY={tr.top} s={1.2} />

			{/* skills bench with cabinet front */}
			<rect x={150} y={980} width={900} height={240} fill={PAL.pale} stroke={PAL.ink} strokeWidth={3} />
			<path d="M 450 990 L 450 1210 M 750 990 L 750 1210" stroke={PAL.ink} strokeWidth={3} />
			{[300, 600, 900].map((x) => (
				<rect key={x} x={x - 34} y={1012} width={68} height={10} rx={5} fill={PAL.light} stroke={PAL.ink} strokeWidth={2.5} />
			))}
			<Table x={150} y={900} w={900} depth={70} />

			{/* the skills station: a block with a soft pad and marked targets */}
			<path
				d="M 336 888 L 336 924 Q 336 940 354 940 L 768 940 Q 786 940 786 924 L 786 888 Z"
				fill={PAL.light}
				stroke={PAL.ink}
				strokeWidth={3.5}
				strokeLinejoin="round"
			/>
			<path
				d="M 390 790 L 732 790 Q 750 790 754 806 L 782 878 Q 788 894 770 894 L 352 894 Q 334 894 340 878 L 368 806 Q 372 790 390 790 Z"
				fill={PAL.white}
				stroke={PAL.ink}
				strokeWidth={3.5}
				strokeLinejoin="round"
			/>
			<path
				d="M 404 806 L 718 806 Q 732 806 736 818 L 756 868 Q 760 880 746 880 L 376 880 Q 362 880 366 868 L 386 818 Q 390 806 404 806 Z"
				fill={PAL.pale}
				stroke={PAL.ink}
				strokeWidth={3}
				strokeLinejoin="round"
			/>
			<path d="M 640 806 L 718 806 Q 732 806 736 818 L 756 868 Q 760 880 746 880 L 690 880 Z" fill={`url(#${ids.dotsPad})`} />
			{/* tick marks along the near edge */}
			{Array.from({length: 13}).map((_, i) => (
				<rect key={i} x={392 + i * 28} y={i % 3 === 0 ? 906 : 910} width={4} height={i % 3 === 0 ? 20 : 12} rx={2} fill={PAL.ink} opacity={0.75} />
			))}
			{/* guide path through the targets */}
			<path
				d={`M ${TARGETS[0][0]} ${TARGETS[0][1]} Q ${(TARGETS[0][0] + TARGETS[1][0]) / 2} ${TARGETS[1][1] - 14} ${TARGETS[1][0]} ${TARGETS[1][1]} Q ${(TARGETS[1][0] + TARGETS[2][0]) / 2} ${TARGETS[1][1] + 4} ${TARGETS[2][0]} ${TARGETS[2][1]}`}
				stroke={PAL.primary}
				strokeWidth={4}
				strokeDasharray="10 9"
				strokeLinecap="round"
				fill="none"
			/>
			{TARGETS.map(([cx, cy], i) =>
				i === ACTIVE ? (
					<g key={i}>
						<ellipse cx={cx} cy={cy} rx={36} ry={21} fill={`url(#${ids.dotsDeep})`} />
						<ellipse cx={cx} cy={cy} rx={21} ry={12.5} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
						<ellipse cx={cx} cy={cy} rx={7} ry={4.5} fill={PAL.white} />
					</g>
				) : (
					<g key={i}>
						<ellipse cx={cx} cy={cy} rx={21} ry={12.5} fill={PAL.white} stroke={PAL.primary} strokeWidth={4} />
						<ellipse cx={cx} cy={cy} rx={6} ry={4} fill={PAL.primary} />
					</g>
				),
			)}

			{/* trainee's arms: one steadies the pad, one works the probe */}
			<Limb pts={[[tr.shoulderL.x, tr.shoulderL.y], [322, 742], [398, 822]]} s={TR.s} color={PAL.primary} coat />
			<Limb pts={[[tr.shoulderR.x, tr.shoulderR.y], [652, 702], probeHand]} s={TR.s} color={PAL.primary} coat hand={false} />
			<g transform={`translate(${tip[0]} ${tip[1] - 4}) rotate(${probeAngle})`}>
				<rect x={10} y={-7} width={104} height={14} rx={7} fill={PAL.deep} stroke={PAL.ink} strokeWidth={3} />
				<rect x={34} y={-9} width={30} height={18} rx={5} fill={PAL.primary} stroke={PAL.ink} strokeWidth={3} />
				<circle cx={6} cy={0} r={8} fill={PAL.white} stroke={PAL.ink} strokeWidth={3} />
			</g>
			<circle cx={probeHand[0]} cy={probeHand[1]} r={17 * TR.s} fill={PAL.skin} />

			{/* coach's guiding arm and a dashed cue toward the next target */}
			<path
				d={`M ${coachHand[0] - 8} ${coachHand[1] + 26} Q ${TARGETS[NEXT][0] + 30} ${TARGETS[NEXT][1] - 34} ${TARGETS[NEXT][0] + 14} ${TARGETS[NEXT][1] - 16}`}
				stroke={PAL.primary}
				strokeWidth={4}
				strokeDasharray="8 8"
				strokeLinecap="round"
				fill="none"
			/>
			<ellipse cx={TARGETS[NEXT][0]} cy={TARGETS[NEXT][1]} rx={34} ry={20} fill="none" stroke={PAL.primary} strokeWidth={3} strokeDasharray="6 7" />
			<Limb pts={[[co.shoulderL.x, co.shoulderL.y], [770, 792], coachHand]} s={CO.s} color={PAL.deep} edge={PAL.ink} />
		</Frame>
	);
};

export default Practice;
