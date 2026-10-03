import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Reveal} from '../components/Reveal';
import {useLayout} from '../components/useLayout';
import type {PromoProps} from '../schema';
import {fontAr, fontEn} from '../theme';

export const StatsScene: React.FC<PromoProps> = (p) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {s, vertical} = useLayout();

	return (
		<AbsoluteFill
			style={{
				direction: 'rtl',
				fontFamily: fontAr,
				alignItems: 'center',
				justifyContent: 'center',
				padding: 80 * s,
			}}
		>
			<Reveal delay={2}>
				<div style={{fontSize: 64 * s, fontWeight: 700, color: 'white'}}>
					أرقام تتحدث عنّا
				</div>
			</Reveal>
			<div
				style={{
					display: 'flex',
					flexDirection: vertical ? 'column' : 'row',
					gap: (vertical ? 70 : 0) * s,
					marginTop: 80 * s,
					width: '100%',
					justifyContent: 'space-around',
				}}
			>
				{p.stats.map((stat, i) => {
					const start = 14 + i * 10;
					const count = interpolate(frame, [start, start + 55], [0, stat.value], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.out(Easing.cubic),
					});
					const pop = spring({frame: frame - start, fps, config: {damping: 200}});
					const ring = interpolate(frame, [start, start + 55], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.out(Easing.cubic),
					});
					const color = i === 1 ? p.accentColor : p.primaryColor;
					const R = 150;
					const label = `${stat.value.toLocaleString('en-US')}${stat.suffix}`;
					const C = 2 * Math.PI * R;
					return (
						<div
							key={i}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								opacity: pop,
								transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})`,
							}}
						>
							<div style={{position: 'relative', width: 340 * s, height: 340 * s}}>
								<svg width={340 * s} height={340 * s} viewBox="0 0 340 340">
									<circle cx={170} cy={170} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
									<circle
										cx={170}
										cy={170}
										r={R}
										fill="none"
										stroke={color}
										strokeWidth={10}
										strokeLinecap="round"
										strokeDasharray={C}
										strokeDashoffset={C * (1 - ring)}
										transform="rotate(-90 170 170)"
										style={{filter: `drop-shadow(0 0 10px ${color})`}}
									/>
								</svg>
								<div
									style={{
										position: 'absolute',
										inset: 0,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontFamily: fontEn,
										fontWeight: 800,
										fontSize: (label.length > 5 ? 64 : 88) * s,
										color: 'white',
										direction: 'ltr',
									}}
								>
									{Math.round(count).toLocaleString('en-US')}
									<span style={{color}}>{stat.suffix}</span>
								</div>
							</div>
							<div
								style={{
									fontSize: 40 * s,
									fontWeight: 500,
									color: 'rgba(255,255,255,0.85)',
									marginTop: 20 * s,
								}}
							>
								{stat.label}
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
