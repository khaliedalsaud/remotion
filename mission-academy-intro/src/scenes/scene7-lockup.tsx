// The closing composition, shared by Scene 7 (where it resolves) and Scene 8
// (where it moves onto the end card). The original mark stands alone; the name
// is set BELOW it as a separate title with generous clear space — it is never
// locked to the mark as if it were part of the logo. The knowledge thread ends
// as a short run beside the mark, at its mid-height.
import {Words} from '../components/Words';
import {LogoMark} from '../components/LogoMark';
import {Ltr} from '../components/Ltr';
import {COLORS, FONT_EN, LOGO, THREAD, WEIGHT} from '../config/brand';
import {CANVAS} from '../config/layout';
import {TEXT} from '../config/script';

const T = TEXT.s7;
const MARK_H = 220;
const MARK_Y = 262;
const NAME = {size: 96, weight: WEIGHT.display};
const EN = {size: 44, weight: WEIGHT.caption};
/** Mark bottom → name line box (the visible gap is ≈ half the mark height). */
const NAME_GAP = 86;
/** Thread end → mark: two bar widths of clear space. */
const THREAD_GAP = 90;
const THREAD_LEN = 240;

export const lockupLayout = () => {
	const markW = MARK_H * LOGO.aspect;
	const markX = CANVAS.cx - markW / 2;
	const nameTop = MARK_Y + MARK_H + NAME_GAP;
	const enTop = nameTop + NAME.size * 1.25 + 4;
	return {
		markX,
		markY: MARK_Y,
		markW,
		markH: MARK_H,
		nameTop,
		enTop,
		/** Bottom of the Latin name's line box. */
		bottom: enTop + EN.size * 1.25,
		/** The thread's resting place: a short run ending beside the mark. */
		rule: {
			left: markX - THREAD_GAP - THREAD_LEN,
			right: markX - THREAD_GAP,
			y: MARK_Y + MARK_H / 2,
		},
		cx: CANVAS.cx,
	};
};

export type Lockup = ReturnType<typeof lockupLayout>;

/** Arabic and Latin name, centered under the mark. `dy` shifts both (px). */
export const LockupText: React.FC<{
	L: Lockup;
	nameStart: number;
	enStart: number;
	nameColor: string;
	enColor: string;
	dy?: number;
}> = ({L, nameStart, enStart, nameColor, enColor, dy = 0}) => (
	<>
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: L.nameTop + dy,
				textAlign: 'center',
				fontSize: NAME.size,
				fontWeight: NAME.weight,
				lineHeight: 1.25,
				whiteSpace: 'nowrap',
				color: nameColor,
			}}
		>
			<Words text={T.nameAr} start={nameStart} stagger={5} duration={20} />
		</div>
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: L.enTop + dy,
				textAlign: 'center',
				fontSize: EN.size,
				fontWeight: EN.weight,
				lineHeight: 1.25,
				whiteSpace: 'nowrap',
				color: enColor,
			}}
		>
			<Ltr style={{fontFamily: FONT_EN}}>
				<Words text={T.nameEn} start={enStart} stagger={4} duration={18} />
			</Ltr>
		</div>
	</>
);

export const LockupMark: React.FC<{L: Lockup; reveal?: number}> = ({L, reveal = 1}) => (
	<LogoMark x={L.markX} y={L.markY} height={L.markH} reveal={reveal} />
);

/** A horizontal run of the thread. */
export const ThreadBar: React.FC<{
	left: number;
	right: number;
	y: number;
	h?: number;
	color?: string;
	radius?: number;
}> = ({left, right, y, h = THREAD.width, color = THREAD.color, radius}) => (
	<div
		style={{
			position: 'absolute',
			left,
			width: Math.max(h, right - left),
			top: y - h / 2,
			height: h,
			borderRadius: radius ?? h / 2,
			background: color,
		}}
	/>
);

export const LOCKUP_COLORS = {name: COLORS.ink, en: COLORS.inkSoft} as const;
