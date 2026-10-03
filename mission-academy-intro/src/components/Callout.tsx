import {COLORS, FONT_AR, WEIGHT} from '../config/brand';
import {EASE, Point, prog} from '../motion';

/**
 * Editorial annotation: a dot on a meaningful detail, a fine leader line, and
 * a short label. All coordinates are in the parent's pixel space.
 * progress 0→1 drives: dot → line → label.
 */
export const Callout: React.FC<{
	target: Point;
	label: Point;
	text: string;
	progress: number;
	/** Which way the label pill extends from `label`. */
	align?: 'left' | 'right';
	fontSize?: number;
	opacity?: number;
}> = ({target, label, text, progress, align = 'left', fontSize = 30, opacity = 1}) => {
	if (progress <= 0 || opacity <= 0) return null;
	const dot = prog(progress, 0, 0.22, EASE.out);
	const line = prog(progress, 0.12, 0.45, EASE.inOut);
	const tag = prog(progress, 0.5, 0.5, EASE.out);
	const len = Math.hypot(label.x - target.x, label.y - target.y);
	const minX = Math.min(target.x, label.x) - 20;
	const minY = Math.min(target.y, label.y) - 20;
	const w = Math.abs(label.x - target.x) + 40;
	const h = Math.abs(label.y - target.y) + 40;
	return (
		<div style={{position: 'absolute', left: 0, top: 0, opacity}}>
			<svg
				style={{position: 'absolute', left: minX, top: minY, overflow: 'visible'}}
				width={w}
				height={h}
			>
				<line
					x1={target.x - minX}
					y1={target.y - minY}
					x2={label.x - minX}
					y2={label.y - minY}
					stroke={COLORS.ink}
					strokeOpacity={0.75}
					strokeWidth={2.5}
					strokeLinecap="round"
					strokeDasharray={`${len} ${len + 4}`}
					strokeDashoffset={len * (1 - line)}
				/>
				<circle
					cx={target.x - minX}
					cy={target.y - minY}
					r={11 * dot}
					fill={COLORS.primary}
					stroke={COLORS.white}
					strokeWidth={4}
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: label.x,
					top: label.y,
					transform: `translate(${align === 'left' ? '-100%' : '0'}, -50%) translateX(${(align === 'left' ? -1 : 1) * (1 - tag) * 14}px)`,
					opacity: tag,
					whiteSpace: 'nowrap',
					fontFamily: FONT_AR,
					fontWeight: WEIGHT.caption,
					fontSize,
					lineHeight: 1.35,
					color: COLORS.ink,
					background: COLORS.white,
					padding: '4px 16px 7px',
					borderRadius: 6,
					borderRight: `5px solid ${COLORS.primary}`,
					boxShadow: '0 6px 18px rgba(24, 43, 69, 0.12)',
					direction: 'rtl',
				}}
			>
				{text}
			</div>
		</div>
	);
};
