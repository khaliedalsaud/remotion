import {getLength, getPointAtLength} from '@remotion/paths';
import {useMemo} from 'react';
import {THREAD} from '../config/brand';

/**
 * The knowledge thread. Draws the portion [from, to] (fractions of the path
 * length) of an SVG path in the parent's pixel space. Animate `to` to draw,
 * animate both to make a dash travel along the path.
 */
export const ThreadPath: React.FC<{
	d: string;
	from?: number;
	to: number;
	width?: number;
	color?: string;
	/** A small dot riding the leading end. */
	head?: boolean;
	opacity?: number;
}> = ({d, from = 0, to, width = THREAD.width, color = THREAD.color, head = false, opacity = 1}) => {
	const len = useMemo(() => getLength(d), [d]);
	const a = Math.max(0, Math.min(1, from));
	const b = Math.max(0, Math.min(1, to));
	const seg = (b - a) * len;
	if (seg < 0.5 || opacity <= 0) return null;
	const tip = head ? getPointAtLength(d, b * len) : null;
	return (
		<svg
			style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}
			width={1}
			height={1}
		>
			<path
				d={d}
				fill="none"
				stroke={color}
				strokeWidth={width}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray={`${seg} ${len + width * 4}`}
				strokeDashoffset={-a * len}
			/>
			{tip ? <circle cx={tip.x} cy={tip.y} r={width * 1.1} fill={color} /> : null}
		</svg>
	);
};
