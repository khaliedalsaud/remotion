import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Slides text up from behind a mask with a blur-to-sharp settle.
export const Reveal: React.FC<{
	delay?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({delay = 0, children, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 28});
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.15em', ...style}}>
			<div
				style={{
					transform: `translateY(${interpolate(p, [0, 1], [110, 0])}%)`,
					opacity: p,
					filter: p > 0.99 ? undefined : `blur(${interpolate(p, [0, 1], [12, 0])}px)`,
				}}
			>
				{children}
			</div>
		</div>
	);
};
