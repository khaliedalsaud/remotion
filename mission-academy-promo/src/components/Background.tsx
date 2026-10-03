import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import type {PromoProps} from '../schema';

const PARTICLES = new Array(60).fill(true).map((_, i) => ({
	x: random(`x-${i}`),
	y: random(`y-${i}`),
	size: 2 + random(`s-${i}`) * 5,
	speed: 0.3 + random(`v-${i}`) * 1.2,
	phase: random(`p-${i}`) * Math.PI * 2,
	gold: random(`c-${i}`) > 0.6,
}));

export const Background: React.FC<PromoProps> = ({
	primaryColor,
	accentColor,
	backgroundColor,
}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const t = frame / 30;

	const glow1X = 30 + Math.sin(t * 0.4) * 15;
	const glow1Y = 30 + Math.cos(t * 0.3) * 10;
	const glow2X = 70 + Math.cos(t * 0.35) * 15;
	const glow2Y = 70 + Math.sin(t * 0.25) * 10;
	const gridShift = (frame * 0.6) % 80;

	return (
		<AbsoluteFill style={{backgroundColor, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at ${glow1X}% ${glow1Y}%, ${accentColor}33 0%, transparent 45%), radial-gradient(circle at ${glow2X}% ${glow2Y}%, ${primaryColor}2A 0%, transparent 45%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${accentColor}14 1px, transparent 1px), linear-gradient(90deg, ${accentColor}14 1px, transparent 1px)`,
					backgroundSize: '80px 80px',
					backgroundPosition: `${gridShift}px ${gridShift}px`,
					maskImage:
						'radial-gradient(ellipse at center, black 10%, transparent 75%)',
					WebkitMaskImage:
						'radial-gradient(ellipse at center, black 10%, transparent 75%)',
				}}
			/>
			{PARTICLES.map((p, i) => {
				const y =
					((p.y * height - frame * p.speed * 2) % height + height) % height;
				const x = p.x * width + Math.sin(t + p.phase) * 20;
				const opacity = interpolate(
					Math.sin(t * 1.5 + p.phase),
					[-1, 1],
					[0.15, 0.8],
				);
				const color = p.gold ? primaryColor : accentColor;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: p.size,
							height: p.size,
							borderRadius: '50%',
							backgroundColor: color,
							opacity,
							boxShadow: `0 0 ${p.size * 3}px ${color}`,
						}}
					/>
				);
			})}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};
