import {interpolate, useCurrentFrame} from 'remotion';
import {EASE, prog} from '../motion';

/**
 * Kinetic text, animated per WORD (never per letter, so Arabic letters stay
 * joined). Each word rises out of a soft mask.
 */
export const Words: React.FC<{
	text: string;
	start: number;
	stagger?: number;
	duration?: number;
	/** Optional exit: words drop out in reverse over [exitAt, exitAt + exitDuration]. */
	exitAt?: number;
	exitDuration?: number;
	style?: React.CSSProperties;
	/** Wrap a word (e.g. in <Highlight>); i is the word index. */
	renderWord?: (word: string, i: number) => React.ReactNode;
}> = ({text, start, stagger = 4, duration = 20, exitAt, exitDuration = 14, style, renderWord}) => {
	const frame = useCurrentFrame();
	const words = text.split(' ');
	return (
		<span style={style}>
			{words.map((w, i) => {
				const p = prog(frame, start + i * stagger, duration, EASE.out);
				const e =
					exitAt === undefined
						? 0
						: prog(frame, exitAt + (words.length - 1 - i) * 2, exitDuration, EASE.in);
				const y = interpolate(p, [0, 1], [0.62, 0]) + e * -0.45;
				const opacity = Math.min(p, 1 - e);
				return (
					<span key={i}>
						{i > 0 ? ' ' : null}
						<span
							style={{
								display: 'inline-block',
								overflow: 'hidden',
								padding: '0.2em 0.06em 0.34em',
								margin: '-0.2em -0.06em -0.34em',
								verticalAlign: 'top',
							}}
						>
							<span
								style={{
									display: 'inline-block',
									transform: `translateY(${y}em)`,
									opacity,
								}}
							>
								{renderWord ? renderWord(w, i) : w}
							</span>
						</span>
					</span>
				);
			})}
		</span>
	);
};
