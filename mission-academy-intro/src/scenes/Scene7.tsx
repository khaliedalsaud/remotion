// Scene 7 (51–56s) — «أكاديمية ميشن»
// Match cut from Scene 6's open window: it shrinks into the corner of a tidy
// board while the film's other clippings gather around the name. They withdraw
// calmly, the original mark grows into the space they leave (the name settles
// beneath it), and the training clipping folds back into the thread, which
// travels home and comes to rest beside the mark.
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Clip} from '../components/Clip';
import {Sfx} from '../components/Sfx';
import {Slot} from '../config/assets';
import {COLORS, THREAD} from '../config/brand';
import {SAFE} from '../config/layout';
import {cue} from '../config/script';
import {EASE, mix, mixRect, prog, Rect} from '../motion';
import {OPEN_RECT, TAG, Tagline, taglineSpans} from './scene6-tagline';
import {LOCKUP_COLORS, LockupMark, LockupText, lockupLayout, ThreadBar} from './scene7-lockup';

const COL_W = 392;
const ROW_H = 220;
const GUT = 24;
/** Column 0 is the rightmost (reading order). */
const cell = (col: number, row: 0 | 1): Rect => ({
	x: SAFE.right - (col + 1) * COL_W - col * GUT,
	y: row === 0 ? SAFE.top : SAFE.bottom - ROW_H,
	w: COL_W,
	h: ROW_H,
});

// `order`: arrival order, right → left, alternating rows.
const BOARD: Array<{slot: Slot; col: number; row: 0 | 1; order: number}> = [
	{slot: 'practitioner', col: 0, row: 0, order: 0},
	{slot: 'interaction', col: 0, row: 1, order: 1},
	{slot: 'learning', col: 1, row: 0, order: 2},
	{slot: 'education', col: 1, row: 1, order: 3},
	{slot: 'practice', col: 2, row: 0, order: 4},
	{slot: 'research', col: 2, row: 1, order: 5},
	{slot: 'conference', col: 3, row: 1, order: 6},
];
const HOME = cell(3, 0);

const GATHER = 8;
const LEAVE = 66;
/** While the board is up the name sits in its middle band; it then settles under the mark. */
const BOARD_NAME_TOP = 432;

export const Scene7: React.FC = () => {
	const frame = useCurrentFrame();
	const nCue = cue('s7', 'name');
	const th = THREAD.width;
	const L = lockupLayout();
	const P = taglineSpans().practice;

	// Scene 6's window shrinks into its cell on the board.
	const shrink = prog(frame, 6, 32, EASE.inOut);
	// Later it folds back into a line along its lower edge…
	const fold = prog(frame, LEAVE + 12, 16, EASE.inOut);
	const foldContent = 1 - prog(frame, LEAVE + 12, 10, EASE.soft);
	const line: Rect = {x: HOME.x, y: HOME.y + HOME.h - th, w: HOME.w, h: th};
	const home = mixRect(mixRect(OPEN_RECT, HOME, shrink), line, fold);

	// …which drops level with the name, then slides under it to rest by the mark.
	const dropY = prog(frame, LEAVE + 28, 10, EASE.inOut);
	const lead = prog(frame, LEAVE + 32, 18, EASE.inOut);
	const tail = prog(frame, LEAVE + 36, 18, EASE.inOut);
	const travelling = fold >= 1;

	// The name only moves once the bottom row has cleared the area it moves through.
	const settle = prog(frame, LEAVE + 26, 26, EASE.inOut);
	const nameDy = mix(BOARD_NAME_TOP - L.nameTop, 0, settle);

	// Scene 6's thread retracts into the window's edge as the tagline leaves.
	const retract = prog(frame, 0, 14, EASE.in);
	const s6Left = home.x + home.w - th;

	return (
		<AbsoluteFill>
			{retract < 1 ? (
				<ThreadBar left={s6Left} right={mix(P.right, s6Left, retract)} y={TAG.underB} />
			) : null}
			{BOARD.map(({slot, col, row, order}) => {
				const target = cell(col, row);
				const arrive = prog(frame, GATHER + order * 2, 24, EASE.out);
				// Top row leaves first (upward) so the mark can grow; the bottom row
				// slides out sideways, never through the caption band.
				const leaveAt = row === 0 ? LEAVE + col * 2.5 : LEAVE + 8 + col * 2.5;
				const leave = prog(frame, leaveAt, 18, EASE.inOut);
				const from: Rect =
					row === 0 ? {...target, y: target.y - 380} : {...target, x: target.x + 320};
				const s = mix(1, 0.92, leave);
				let rect = mixRect(from, target, arrive);
				rect =
					row === 0
						? {...rect, y: rect.y - 120 * leave}
						: {...rect, x: rect.x - 160 * leave};
				rect = {
					x: rect.x + (rect.w * (1 - s)) / 2,
					y: rect.y + (rect.h * (1 - s)) / 2,
					w: rect.w * s,
					h: rect.h * s,
				};
				return (
					<Clip
						key={slot}
						rect={rect}
						slot={slot}
						border={6}
						shadow={0.6}
						opacity={arrive > 0 ? 1 - leave : 0}
					/>
				);
			})}
			{!travelling ? (
				<Clip
					rect={home}
					slot="training"
					border={mix(mix(8, 6, shrink), 0, fold)}
					shadow={mix(mix(1, 0.6, shrink), 0, fold)}
					radius={mix(3, th / 2, fold)}
					fill={COLORS.primary}
					contentOpacity={foldContent}
					zoom={{scale: 1, x: 0.55, y: 0.45}}
				/>
			) : (
				<ThreadBar
					left={mix(line.x, L.rule.left, tail)}
					right={mix(line.x + line.w, L.rule.right, lead)}
					y={mix(line.y + th / 2, L.rule.y, dropY)}
				/>
			)}
			<LockupMark L={L} reveal={prog(frame, LEAVE + 18, 24, EASE.inOut)} />
			<LockupText
				L={L}
				nameStart={nCue - 4}
				enStart={nCue + 6}
				nameColor={LOCKUP_COLORS.name}
				enColor={LOCKUP_COLORS.en}
				dy={nameDy}
			/>
			<Tagline start={-60} exitAt={0} exitDuration={10} practiceColor={COLORS.primary} />
			<Sfx at={0} name="swipe" volume={0.3} />
			<Sfx at={6} name="whoosh" volume={0.45} />
			<Sfx at={GATHER + 4} name="paper" volume={0.4} />
			<Sfx at={nCue - 4} name="tick" volume={0.35} />
			<Sfx at={LEAVE + 18} name="swell" volume={0.5} />
			<Sfx at={LEAVE} name="swipe" volume={0.3} />
			<Sfx at={LEAVE + 12} name="paper" volume={0.45} />
			<Sfx at={LEAVE + 32} name="swipe" volume={0.4} />
			<Sfx at={LEAVE + 50} name="tick" volume={0.45} />
		</AbsoluteFill>
	);
};
