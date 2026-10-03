import {Easing, interpolate} from 'remotion';

export type Rect = {x: number; y: number; w: number; h: number};
export type Point = {x: number; y: number};

// No overshoot anywhere: motion should feel editorial, not cartoony.
export const EASE = {
	/** Camera moves, morphs, anything travelling between two states. */
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	/** Entrances: fast start, long settle. */
	out: Easing.bezier(0.16, 1, 0.3, 1),
	/** Exits. */
	in: Easing.bezier(0.7, 0, 0.84, 0),
	/** Gentle drift (slow push-ins). */
	soft: Easing.bezier(0.45, 0, 0.55, 1),
} as const;

/** 0→1 over [start, start + duration], clamped. */
export const prog = (
	frame: number,
	start: number,
	duration: number,
	easing: (t: number) => number = EASE.out,
) =>
	interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const mixRect = (a: Rect, b: Rect, t: number): Rect => ({
	x: mix(a.x, b.x, t),
	y: mix(a.y, b.y, t),
	w: mix(a.w, b.w, t),
	h: mix(a.h, b.h, t),
});

export const mixPoint = (a: Point, b: Point, t: number): Point => ({
	x: mix(a.x, b.x, t),
	y: mix(a.y, b.y, t),
});

/** Keyframed value with per-segment easing. keys must be sorted by frame. */
export const keyframes = (
	frame: number,
	keys: Array<[number, number]>,
	easing: (t: number) => number = EASE.inOut,
) => {
	if (frame <= keys[0][0]) return keys[0][1];
	for (let i = 0; i < keys.length - 1; i++) {
		const [f0, v0] = keys[i];
		const [f1, v1] = keys[i + 1];
		if (frame <= f1) {
			return mix(v0, v1, easing((frame - f0) / Math.max(1, f1 - f0)));
		}
	}
	return keys[keys.length - 1][1];
};
