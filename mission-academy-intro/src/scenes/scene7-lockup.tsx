// The closing lockup, shared by Scene 7 (where it resolves) and Scene 8 (where
// it moves onto the end card): the original mark on the right, the name set as
// live text to its left, and the knowledge thread ending as a short rule
// between the Arabic and the Latin name, right beside the mark.
import {Words} from '../components/Words';
import {LogoMark} from '../components/LogoMark';
import {Ltr} from '../components/Ltr';
import {COLORS, FONT_EN, LOGO, THREAD, WEIGHT} from '../config/brand';
import {CANVAS} from '../config/layout';
import {TEXT} from '../config/script';
import {textWidth} from '../measure';

const T = TEXT.s7;
const MARK_H = 220;
const NAME = {size: 96, weight: WEIGHT.display};
const EN = {size: 44, weight: WEIGHT.caption};
/** Clear space between mark and text: comfortably more than one bar width. */
const GAP = 64;
const CY = 500;

export const lockupLayout = () => {
	const wAr = textWidth(T.nameAr, NAME.size, NAME.weight);
	const wEn = textWidth(T.nameEn, EN.size, EN.weight, FONT_EN);
	const textW = Math.max(wAr, wEn);
	const markW = MARK_H * LOGO.aspect;
	const left = CANVAS.cx - (textW + GAP + markW) / 2;
	const markX = left + textW + GAP;
	const markY = CY - MARK_H / 2;
	const textRight = markX - GAP;
	const nameTop = markY;
	const ruleY = nameTop + NAME.size * 1.42;
	return {
		markX,
		markY,
		markW,
		markH: MARK_H,
		textRight,
		nameTop,
		/** The thread's resting place: under the Arabic name, ending beside the mark. */
		rule: {left: textRight - wAr, right: textRight, y: ruleY},
		enTop: ruleY + 8,
		/** Center of the whole lockup (for moving it as one). */
		cx: CANVAS.cx,
		cy: CY,
	};
};

export type Lockup = ReturnType<typeof lockupLayout>;

/** Mark + Arabic and Latin name. Positions are screen px from lockupLayout(). */
export const LockupText: React.FC<{
	L: Lockup;
	nameStart: number;
	enStart: number;
	nameColor: string;
	enColor: string;
	/** Vertical nudge of the Latin name (px). */
	enShift?: number;
}> = ({L, nameStart, enStart, nameColor, enColor, enShift = 0}) => (
	<>
		<div
			style={{
				position: 'absolute',
				right: CANVAS.width - L.textRight,
				top: L.nameTop,
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
				right: CANVAS.width - L.textRight,
				top: L.enTop + enShift,
				fontSize: EN.size,
				fontWeight: EN.weight,
				lineHeight: 1.25,
				whiteSpace: 'nowrap',
				color: enColor,
			}}
		>
			<Ltr>
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
