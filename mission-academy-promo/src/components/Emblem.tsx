import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Target + arrow mark: "mission" = aim, focus, hitting the goal.
export const Emblem: React.FC<{
	size: number;
	primaryColor: string;
	accentColor: string;
	delay?: number;
}> = ({size, primaryColor, accentColor, delay = 0}) => {
	const frame = useCurrentFrame() - delay;
	const {fps} = useVideoConfig();

	const ring = (i: number) =>
		interpolate(frame, [i * 6, i * 6 + 30], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.out(Easing.cubic),
		});
	const arrow = spring({frame: frame - 28, fps, config: {damping: 12, mass: 0.6}});
	const impact = spring({frame: frame - 38, fps, config: {damping: 8}});
	const rotate = interpolate(frame, [0, 60], [-90, 0], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	const radii = [90, 64, 38];
	const arrowOffset = interpolate(arrow, [0, 1], [160, 0]);

	return (
		<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="emblem-g" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor={primaryColor} />
					<stop offset="100%" stopColor={accentColor} />
				</linearGradient>
			</defs>
			<g transform={`rotate(${rotate} 100 100)`}>
				{radii.map((r, i) => {
					const c = 2 * Math.PI * r;
					return (
						<circle
							key={r}
							cx={100}
							cy={100}
							r={r}
							fill="none"
							stroke="url(#emblem-g)"
							strokeWidth={i === 0 ? 7 : 5}
							strokeLinecap="round"
							strokeDasharray={c}
							strokeDashoffset={c * (1 - ring(i))}
							opacity={1 - i * 0.15}
						/>
					);
				})}
			</g>
			<circle
				cx={100}
				cy={100}
				r={14 * impact}
				fill={primaryColor}
				style={{filter: `drop-shadow(0 0 12px ${primaryColor})`}}
			/>
			<circle
				cx={100}
				cy={100}
				r={14 + impact * 80}
				fill="none"
				stroke={primaryColor}
				strokeWidth={3}
				opacity={interpolate(impact, [0, 0.2, 1], [0, 0.8, 0], {
					extrapolateRight: 'clamp',
				})}
			/>
			<g
				transform={`translate(${arrowOffset} ${-arrowOffset})`}
				opacity={arrow > 0.01 ? 1 : 0}
			>
				<line
					x1={104}
					y1={96}
					x2={178}
					y2={22}
					stroke="#FFFFFF"
					strokeWidth={6}
					strokeLinecap="round"
				/>
				<path d="M100 100 L120 96 L104 80 Z" fill="#FFFFFF" />
				<path d="M178 22 L196 18 L182 4 Z M170 30 L188 26 L174 12 Z" fill={accentColor} />
			</g>
		</svg>
	);
};
