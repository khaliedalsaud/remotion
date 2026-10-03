import {Img, staticFile} from 'remotion';
import {LOGO} from '../config/brand';

/**
 * The supplied logo mark, unaltered. `reveal` (0→1) grows each bar downward
 * from its top, in order, by clipping the original image — the final frame is
 * always the untouched logo. Position is the mark's top-left corner.
 */
export const LogoMark: React.FC<{
	x: number;
	y: number;
	height: number;
	reveal?: number;
	opacity?: number;
}> = ({x, y, height, reveal = 1, opacity = 1}) => {
	const width = height * LOGO.aspect;
	const src = staticFile(LOGO.src);
	const box: React.CSSProperties = {position: 'absolute', left: x, top: y, width, height, opacity};
	if (reveal >= 1) {
		return <Img src={src} style={box} />;
	}
	if (reveal <= 0) return null;
	const stagger = 0.18;
	return (
		<div style={box}>
			{LOGO.bars.map((bar, i) => {
				const p = Math.max(0, Math.min(1, (reveal * (1 + stagger * 2) - i * stagger) / 1));
				const top = bar.top * 100 - 2;
				const bottom = (1 - (bar.top + (bar.bottom - bar.top) * p)) * 100 - (p >= 1 ? 2 : 0);
				return (
					<Img
						key={i}
						src={src}
						style={{
							position: 'absolute',
							inset: 0,
							width: '100%',
							height: '100%',
							clipPath: `inset(${top}% ${(1 - bar.right) * 100 - 2}% ${Math.max(0, bottom)}% ${bar.left * 100 - 2}%)`,
							opacity: p > 0 ? 1 : 0,
						}}
					/>
				);
			})}
		</div>
	);
};

/** Screen rects of the three bars for a mark placed at (x, y) with `height`. */
export const logoBarRects = (x: number, y: number, height: number) => {
	const width = height * LOGO.aspect;
	return LOGO.bars.map((b) => ({
		x: x + b.left * width,
		y: y + b.top * height,
		w: (b.right - b.left) * width,
		h: (b.bottom - b.top) * height,
		color: b.color,
	}));
};
