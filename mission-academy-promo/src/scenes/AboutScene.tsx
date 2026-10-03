import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Emblem} from '../components/Emblem';
import {Reveal} from '../components/Reveal';
import {useLayout} from '../components/useLayout';
import type {PromoProps} from '../schema';
import {fontAr} from '../theme';

export const AboutScene: React.FC<PromoProps> = (p) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {s, vertical} = useLayout();
	const words = p.aboutText.split(' ');
	const bar = spring({frame: frame - 6, fps, config: {damping: 200}});

	return (
		<AbsoluteFill
			style={{
				direction: 'rtl',
				fontFamily: fontAr,
				flexDirection: vertical ? 'column' : 'row',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 100 * s,
				padding: vertical ? 80 * s : 160 * s,
			}}
		>
			<div style={{flex: vertical ? undefined : 1.4, maxWidth: vertical ? 900 * s : undefined}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 20 * s}}>
					<div
						style={{
							width: 12 * s,
							height: 80 * s * bar,
							background: p.primaryColor,
							borderRadius: 6,
						}}
					/>
					<Reveal delay={8}>
						<div style={{fontSize: 80 * s, fontWeight: 700, color: 'white'}}>
							{p.aboutTitle}
						</div>
					</Reveal>
				</div>
				<div
					style={{
						marginTop: 40 * s,
						fontSize: 58 * s,
						fontWeight: 500,
						lineHeight: 1.7,
						color: 'rgba(255,255,255,0.9)',
					}}
				>
					{words.map((w, i) => {
						const o = interpolate(frame, [20 + i * 3, 32 + i * 3], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						});
						return (
							<span
								key={i}
								style={{
									display: 'inline-block',
									opacity: o,
									transform: `translateY(${(1 - o) * 20}px)`,
									marginLeft: '0.28em',
								}}
							>
								{w}
							</span>
						);
					})}
				</div>
			</div>
			<div style={{opacity: 0.9}}>
				<Emblem
					size={(vertical ? 360 : 440) * s}
					primaryColor={p.primaryColor}
					accentColor={p.accentColor}
					delay={6}
				/>
			</div>
		</AbsoluteFill>
	);
};
