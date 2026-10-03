import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PILLAR_ICONS} from '../components/Icons';
import {Reveal} from '../components/Reveal';
import {useLayout} from '../components/useLayout';
import type {PromoProps} from '../schema';
import {fontAr} from '../theme';

export const PillarsScene: React.FC<PromoProps> = (p) => {
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
				<div style={{fontSize: 72 * s, fontWeight: 700, color: 'white', textAlign: 'center'}}>
					لماذا <span style={{color: p.primaryColor}}>{p.academyNameAr}</span>؟
				</div>
			</Reveal>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: vertical ? '1fr 1fr' : 'repeat(4, 1fr)',
					gap: 36 * s,
					marginTop: 70 * s,
					width: '100%',
				}}
			>
				{p.pillars.map((pillar, i) => {
					const delay = 18 + i * 12;
					const pop = spring({frame: frame - delay, fps, config: {damping: 14, mass: 0.8}});
					const Icon = PILLAR_ICONS[i];
					const active = interpolate(
						frame,
						[90 + i * 22, 100 + i * 22, 118 + i * 22],
						[0, 1, 0],
						{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
					);
					const color = i % 2 === 0 ? p.primaryColor : p.accentColor;
					return (
						<div
							key={i}
							style={{
								opacity: interpolate(pop, [0, 1], [0, 1], {extrapolateRight: 'clamp'}),
								transform: `translateY(${(1 - pop) * 120}px) scale(${1 + active * 0.04})`,
								background: `linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02))`,
								border: `1.5px solid ${color}${active > 0.1 ? 'CC' : '44'}`,
								borderRadius: 32 * s,
								padding: `${54 * s}px ${30 * s}px`,
								textAlign: 'center',
								boxShadow: `0 30px 80px rgba(0,0,0,0.35), 0 0 ${60 * active}px ${color}55`,
							}}
						>
							<div
								style={{
									width: 130 * s,
									height: 130 * s,
									margin: '0 auto',
									borderRadius: '50%',
									background: `${color}1F`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Icon color={color} size={72 * s} />
							</div>
							<div style={{fontSize: 46 * s, fontWeight: 700, color: 'white', marginTop: 30 * s}}>
								{pillar.title}
							</div>
							<div
								style={{
									fontSize: 30 * s,
									fontWeight: 300,
									color: 'rgba(255,255,255,0.75)',
									marginTop: 12 * s,
									lineHeight: 1.6,
								}}
							>
								{pillar.text}
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
