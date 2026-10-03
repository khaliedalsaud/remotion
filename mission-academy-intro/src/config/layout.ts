import type {Rect} from '../motion';

// Landscape 16:9 layout. A 9:16 recompose adds a sibling preset with the same
// keys; scenes read geometry from here rather than hard-coding the canvas.
export const CANVAS = {width: 1920, height: 1080, cx: 960, cy: 540} as const;

/** Titles and key content live inside SAFE; captions own the band below it. */
export const SAFE = {left: 140, right: 1780, top: 110, bottom: 890} as const;

export const CAPTION_ZONE = {centerY: 978, maxWidth: 1300, fontSize: 36} as const;

// Screen-space states that two adjacent scenes must agree on exactly so the
// cut between them reads as one continuous move (match cut).
export const HANDOFF = {
	/** S1 ends / S2 starts: the training window opened by the thread. */
	s1s2Window: {x: 160, y: 190, w: 700, h: 600} satisfies Rect,
	/** S2 ends / S3 starts: a horizontal thread segment (right → left). */
	s2s3Line: {xRight: 1780, xLeft: 980, y: 262},
	/**
	 * S3 ends / S4 starts: camera has pushed into a thread node. Filled
	 * primary dot with a white ring, centered on screen, with the thread
	 * entering horizontally from the right edge of the frame. All values are
	 * SCREEN px at the cut: dot radius r, white ring of width `ring` around it,
	 * thread stroke `lineWidth` from the dot to x = 1920+ at y.
	 */
	s3s4Node: {x: 960, y: 540, r: 26, ring: 8, lineWidth: 22},
	/**
	 * S4 ends / S5 starts: the conference clipping in this SCREEN rect, drawn
	 * with <Clip border={8} shadow={1} tilt={0} zoom={scale 1, center}>, nothing
	 * else on screen.
	 */
	s4s5Clip: {x: 520, y: 200, w: 880, h: 560} satisfies Rect,
	/** S5 ends / S6 starts: the network converges to a single dot. */
	s5s6Dot: {x: 1480, y: 470, r: 12},
} as const;
