// Reference illustration: a training session. An instructor walks trainees
// through a connected-process diagram on a screen — the same "thread" idea
// the film is built on. Foreground trainees are seen from behind.
import {Badge, Board, Doc, Frame, Halftone, Person, PAL, personAnchors, Table, useAmbientFrame, useIds} from './kit';

export const focus = {
	/** The diagram on the screen. */
	board: [0.64, 0.4],
	/** The instructor's pointing hand. */
	hand: [0.47, 0.5],
	/** Notes on the desk. */
	notes: [0.5, 0.76],
} as const;

const Training: React.FC = () => {
	const ids = useIds('dots', 'dotsDeep');
	const t = useAmbientFrame();
	const sway = Math.sin(t / 38) * 4;
	const instructor = personAnchors(400, 770, 1.15);
	return (
		<Frame bg={PAL.mist}>
			<defs>
				<Halftone id={ids.dots} color={PAL.light} spacing={18} r={4} />
				<Halftone id={ids.dotsDeep} color={PAL.primary} spacing={14} r={2.6} opacity={0.55} />
			</defs>
			<circle cx={700} cy={520} r={430} fill={`url(#${ids.dots})`} />
			<rect x={0} y={900} width={1200} height={300} fill={PAL.pale} />
			<Board x={540} y={290} w={500} h={360}>
				<rect x={580} y={330} width={150} height={16} rx={5} fill={PAL.deep} />
				<path d="M 620 500 C 690 500 700 420 790 420 C 880 420 880 500 960 500" stroke={PAL.primary} strokeWidth={9} fill="none" strokeLinecap="round" />
				{[
					[620, 500],
					[790, 420],
					[960, 500],
				].map(([cx, cy], i) => (
					<g key={i}>
						<circle cx={cx} cy={cy} r={34} fill={i === 1 ? PAL.primary : PAL.white} stroke={PAL.primary} strokeWidth={7} />
						<rect x={cx - 44} y={cy + 52} width={88} height={8} rx={4} fill={PAL.light} />
						<rect x={cx - 30} y={cy + 68} width={60} height={8} rx={4} fill={PAL.light} />
					</g>
				))}
				<rect x={580} y={590} width={420} height={30} rx={6} fill={`url(#${ids.dotsDeep})`} />
			</Board>
			<g transform={`rotate(${sway * 0.15} ${instructor.shoulderR.x} ${instructor.shoulderR.y})`}>
				<Person x={400} y={770} s={1.15} coat body={PAL.deep} wear="hijab" wearColor={PAL.ink} armR="point" armL="hold" legs />
			</g>
			<Badge x={400} neckY={instructor.top} s={1.15} />
			<Table x={150} y={880} w={940} depth={92} />
			<Doc x={520} y={884} w={130} h={58} rotate={-5} lines={2} mark={0} heading={false} />
			<Doc x={690} y={888} w={130} h={56} rotate={3} lines={2} heading={false} />
			<Person x={300} y={1120} s={1.45} back body={PAL.primary} wear="ghutra" armL="none" armR="none" />
			<Person x={1010} y={1130} s={1.45} back body={PAL.deep} wear="hijab" wearColor={PAL.mid} armL="none" armR="none" />
		</Frame>
	);
};

export default Training;
