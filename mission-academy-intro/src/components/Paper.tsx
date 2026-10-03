import {AbsoluteFill, staticFile} from 'remotion';
import {COLORS} from '../config/brand';
import {SAFE} from '../config/layout';

const GRID = 120;

const CropMark: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x} ${y})`} stroke={COLORS.ink} strokeOpacity={0.22} strokeWidth={1.5}>
		<line x1={-12} y1={0} x2={12} y2={0} />
		<line x1={0} y1={-12} x2={0} y2={12} />
	</g>
);

/** Light editorial ground: paper tone, faint grain, a fine grid and crop marks. */
export const Paper: React.FC<{gridOpacity?: number}> = ({gridOpacity = 1}) => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.paper}}>
			<AbsoluteFill
				style={{
					backgroundImage: `url(${staticFile('textures/paper.png')})`,
					backgroundSize: '512px 512px',
					mixBlendMode: 'multiply',
					opacity: 0.55,
				}}
			/>
			<AbsoluteFill
				style={{
					opacity: gridOpacity,
					backgroundImage: `linear-gradient(to right, ${COLORS.line} 1px, transparent 1px), linear-gradient(to bottom, ${COLORS.line} 1px, transparent 1px)`,
					backgroundSize: `${GRID}px ${GRID}px`,
					backgroundPosition: `${SAFE.left % GRID}px ${SAFE.top % GRID}px`,
				}}
			/>
			<AbsoluteFill style={{opacity: gridOpacity}}>
				<svg width="100%" height="100%">
					<CropMark x={SAFE.left} y={SAFE.top} />
					<CropMark x={SAFE.right} y={SAFE.top} />
					<CropMark x={SAFE.left} y={SAFE.bottom} />
					<CropMark x={SAFE.right} y={SAFE.bottom} />
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
