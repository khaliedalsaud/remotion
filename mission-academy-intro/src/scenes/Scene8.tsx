// Scene 8 (56–60s) — end card.
// The thread beside the logo unfolds one last time — into the whole deep-blue
// field. The mark keeps a white badge (it has no dark-ground version), the name
// turns light where the field passes behind it, and the call to action settles
// beneath. Frames 60–119 are completely still.
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {Ltr} from '../components/Ltr';
import {Sfx} from '../components/Sfx';
import {Words} from '../components/Words';
import {COLORS, FONT_EN, THREAD, WEIGHT} from '../config/brand';
import {CANVAS} from '../config/layout';
import {TEXT} from '../config/script';
import {EASE, mix, mixRect, prog, Rect} from '../motion';
import {LockupMark, LockupText, lockupLayout} from './scene7-lockup';

const T = TEXT.s8;
const BADGE_PAD = 34;
const LIFT = -110;
const CTA = {top: 600, size: 64, weight: WEIGHT.title};
const WEB = {top: 708, size: 40, weight: WEIGHT.caption};

export const Scene8: React.FC = () => {
	const frame = useCurrentFrame();
	const th = THREAD.width;
	const L = lockupLayout();
	const {width: W, height: H} = CANVAS;

	// The thread widens across the frame, then thickens into the field.
	const widen = prog(frame, 6, 18, EASE.inOut);
	const thicken = prog(frame, 14, 26, EASE.inOut);
	const field: Rect = {
		x: mix(L.rule.left, 0, widen),
		y: mix(L.rule.y - th / 2, 0, thicken),
		w: mix(L.rule.right - L.rule.left, W, widen),
		h: mix(th, H, thicken),
	};
	const fieldColor = interpolateColors(thicken, [0, 0.55], [COLORS.primary, COLORS.deep]);

	// Ahead of it, the mark is given a white badge so it never sits on blue.
	const mark: Rect = {x: L.markX, y: L.markY, w: L.markW, h: L.markH};
	const padded: Rect = {
		x: mark.x - BADGE_PAD,
		y: mark.y - BADGE_PAD,
		w: mark.w + BADGE_PAD * 2,
		h: mark.h + BADGE_PAD * 2,
	};
	const badgeIn = prog(frame, 0, 14, EASE.out);
	const badge = mixRect(mark, padded, badgeIn);

	// Then the lockup lifts to make room for the call to action (shifted by half
	// the badge padding so the badged lockup is centered), and the gap the
	// thread left between the two names closes.
	const settle = prog(frame, 22, 26, EASE.inOut);
	const tx = mix(0, -BADGE_PAD / 2, settle);
	const ty = mix(0, LIFT, settle);

	// Two-tone wipe: light text where the field is behind it, dark elsewhere.
	const top = field.y - ty;
	const bottom = field.y + field.h - ty;
	const inBand = `inset(${top}px -100px ${H - bottom}px -100px)`;
	const outBand = `polygon(evenodd, -100px -2000px, ${W + 100}px -2000px, ${W + 100}px ${H + 2000}px, -100px ${H + 2000}px, -100px -2000px, -100px ${top}px, ${W + 100}px ${top}px, ${W + 100}px ${bottom}px, -100px ${bottom}px, -100px ${top}px)`;
	const dark = thicken < 1;
	const light = thicken > 0;
	const enShift = mix(0, -14, settle);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: field.x,
					top: field.y,
					width: field.w,
					height: field.h,
					borderRadius: mix(th / 2, 0, thicken),
					background: fieldColor,
				}}
			/>
			<AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px)`}}>
				{badgeIn > 0 ? (
					<div
						style={{
							position: 'absolute',
							left: badge.x,
							top: badge.y,
							width: badge.w,
							height: badge.h,
							borderRadius: mix(4, 28, badgeIn),
							background: COLORS.white,
							opacity: prog(frame, 0, 6, EASE.out),
							boxShadow: `0 ${18 * badgeIn}px ${44 * badgeIn}px rgba(3, 20, 56, ${0.28 * thicken})`,
						}}
					/>
				) : null}
				<LockupMark L={L} />
				{dark ? (
					<AbsoluteFill style={{clipPath: light ? outBand : undefined}}>
						<LockupText
							L={L}
							nameStart={-60}
							enStart={-60}
							nameColor={COLORS.ink}
							enColor={COLORS.inkSoft}
							enShift={enShift}
						/>
					</AbsoluteFill>
				) : null}
				{light ? (
					<AbsoluteFill style={{clipPath: dark ? inBand : undefined}}>
						<LockupText
							L={L}
							nameStart={-60}
							enStart={-60}
							nameColor={COLORS.white}
							enColor={COLORS.light}
							enShift={enShift}
						/>
					</AbsoluteFill>
				) : null}
			</AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: CTA.top,
					textAlign: 'center',
					fontSize: CTA.size,
					fontWeight: CTA.weight,
					lineHeight: 1.3,
					color: COLORS.white,
				}}
			>
				<Words text={T.cta} start={34} stagger={2} duration={18} />
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: WEB.top,
					textAlign: 'center',
					fontSize: WEB.size,
					fontWeight: WEB.weight,
					lineHeight: 1.3,
					color: COLORS.light,
				}}
			>
				<Ltr style={{fontFamily: FONT_EN}}>
					<Words text={T.website} start={40} duration={18} />
				</Ltr>
			</div>
			<Sfx at={0} name="pop" volume={0.3} />
			<Sfx at={8} name="swell" volume={0.5} />
			<Sfx at={34} name="tick" volume={0.3} />
		</AbsoluteFill>
	);
};
