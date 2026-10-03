import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CANVAS} from '../config/layout';
import {EASE, Point} from '../motion';

export type CamKey = {f: number; x: number; y: number; s: number};
export type CamState = {x: number; y: number; s: number};

/** Camera state at a frame. Scale is interpolated in log space (even zoom speed). */
export const camAt = (frame: number, keys: CamKey[], easing = EASE.inOut): CamState => {
	if (frame <= keys[0].f) return keys[0];
	for (let i = 0; i < keys.length - 1; i++) {
		const k0 = keys[i];
		const k1 = keys[i + 1];
		if (frame <= k1.f) {
			const t = easing((frame - k0.f) / Math.max(1, k1.f - k0.f));
			return {
				x: k0.x + (k1.x - k0.x) * t,
				y: k0.y + (k1.y - k0.y) * t,
				s: Math.exp(Math.log(k0.s) + (Math.log(k1.s) - Math.log(k0.s)) * t),
			};
		}
	}
	return keys[keys.length - 1];
};

export const worldToScreen = (p: Point, cam: CamState): Point => ({
	x: CANVAS.cx + (p.x - cam.x) * cam.s,
	y: CANVAS.cy + (p.y - cam.y) * cam.s,
});

/**
 * Renders children in "world" pixels, viewed through a camera centered on
 * (x, y) at scale s. With {x: 960, y: 540, s: 1} world == screen.
 */
export const Camera: React.FC<{keys: CamKey[]; children: React.ReactNode}> = ({keys, children}) => {
	const frame = useCurrentFrame();
	const cam = camAt(frame, keys);
	return (
		<AbsoluteFill
			style={{
				transformOrigin: '0 0',
				transform: `translate(${CANVAS.cx - cam.x * cam.s}px, ${CANVAS.cy - cam.y * cam.s}px) scale(${cam.s})`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
