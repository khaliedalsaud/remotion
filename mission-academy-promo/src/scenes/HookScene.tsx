import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Reveal} from '../components/Reveal';
import {useLayout} from '../components/useLayout';
import type {PromoProps} from '../schema';
import {fontAr} from '../theme';

export const HookScene: React.FC<PromoProps> = (p) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {s} = useLayout();
	const underline = spring({frame: frame - 34, fps, config: {damping: 200}, durationInFrames: 30});
	const drift = interpolate(frame, [0, 120], [1, 1.06]);

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				direction: 'rtl',
				fontFamily: fontAr,
				textAlign: 'center',
				transform: `scale(${drift})`,
			}}
		>
			<Reveal delay={4}>
				<div style={{fontSize: 90 * s, fontWeight: 300, color: 'rgba(255,255,255,0.85)'}}>
					{p.hookLine1}
				</div>
			</Reveal>
			<Reveal delay={16}>
				<div
					style={{
						fontSize: 170 * s,
						fontWeight: 700,
						color: p.primaryColor,
						lineHeight: 1.25,
					}}
				>
					{p.hookLine2}
				</div>
			</Reveal>
			<div
				style={{
					height: 8 * s,
					width: 420 * s * underline,
					borderRadius: 8,
					background: `linear-gradient(90deg, ${p.accentColor}, ${p.primaryColor})`,
					marginTop: 10 * s,
				}}
			/>
		</AbsoluteFill>
	);
};
