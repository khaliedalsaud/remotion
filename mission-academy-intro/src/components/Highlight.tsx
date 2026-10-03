import {COLORS} from '../config/brand';

export type HighlightVariant = 'solid' | 'soft' | 'underline';

/**
 * A marker strip that sweeps in behind a word, right → left (reading
 * direction). 'solid' = primary blue strip with the covered part of the word
 * turning white (a crisp two-tone wipe), 'soft' = pale strip under ink text,
 * 'underline' = thread-weight bar below.
 */
export const Highlight: React.FC<{
	progress: number;
	variant?: HighlightVariant;
	color?: string;
	textColor?: string;
	children: React.ReactNode;
}> = ({progress, variant = 'solid', color, textColor = COLORS.ink, children}) => {
	const p = Math.max(0, Math.min(1, progress));
	const bar = color ?? (variant === 'soft' ? COLORS.pale : COLORS.primary);
	const barStyle: React.CSSProperties =
		variant === 'underline'
			? {left: 0, right: 0, bottom: '0.02em', height: '0.075em', borderRadius: 999}
			: {left: '-0.1em', right: '-0.1em', top: '0.2em', bottom: '0.06em', borderRadius: '0.06em'};
	return (
		<span style={{position: 'relative', display: 'inline-block', whiteSpace: 'nowrap'}}>
			<span
				style={{
					position: 'absolute',
					...barStyle,
					background: bar,
					transform: `scaleX(${p})`,
					transformOrigin: 'right center',
				}}
			/>
			<span style={{position: 'relative', color: textColor}}>{children}</span>
			{variant === 'solid' && p > 0 ? (
				<span
					aria-hidden
					style={{
						position: 'absolute',
						inset: 0,
						color: COLORS.white,
						// Only the part of the word inside the strip turns white; dots and
						// tails that hang below it stay ink so they never vanish on paper.
						clipPath: `inset(0.2em -0.1em 0.06em calc(${(1 - p) * 100}% - ${p * 0.1}em))`,
					}}
				>
					{children}
				</span>
			) : null}
		</span>
	);
};
