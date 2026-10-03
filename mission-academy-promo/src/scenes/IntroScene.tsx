import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Emblem} from '../components/Emblem';
import {useLayout} from '../components/useLayout';
import type {PromoProps} from '../schema';
import {fontAr, fontEn} from '../theme';

export const IntroScene: React.FC<PromoProps> = (p) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {s} = useLayout();
	const name = spring({frame: frame - 42, fps, config: {damping: 200}});
	const en = spring({frame: frame - 52, fps, config: {damping: 200}});
	const tracking = interpolate(en, [0, 1], [40, 14]);
	const sweep = interpolate(frame, [50, 80], [-120, 220], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const zoom = interpolate(frame, [0, 90], [1.08, 1]);

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				transform: `scale(${zoom})`,
			}}
		>
			<Emblem size={300 * s} primaryColor={p.primaryColor} accentColor={p.accentColor} />
			<div
				style={{
					position: 'relative',
					marginTop: 40 * s,
					fontFamily: fontAr,
					fontWeight: 700,
					fontSize: 120 * s,
					color: 'white',
					direction: 'rtl',
					opacity: name,
					transform: `translateY(${interpolate(name, [0, 1], [40, 0])}px)`,
					backgroundImage: `linear-gradient(100deg, #fff 0%, #fff ${sweep - 20}%, ${p.primaryColor} ${sweep}%, #fff ${sweep + 20}%, #fff 100%)`,
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					lineHeight: 1.3,
				}}
			>
				{p.academyNameAr}
			</div>
			<div
				style={{
					fontFamily: fontEn,
					fontWeight: 600,
					fontSize: 34 * s,
					letterSpacing: tracking * s,
					color: p.primaryColor,
					opacity: en,
					marginTop: 6 * s,
				}}
			>
				{p.academyNameEn}
			</div>
		</AbsoluteFill>
	);
};
