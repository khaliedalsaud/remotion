import {Img, staticFile} from 'remotion';
import {PHOTOS, Slot} from '../config/assets';
import {COLORS} from '../config/brand';
import {Illustration} from '../illustrations';
import type {Rect} from '../motion';

export type ClipZoom = {scale: number; x: number; y: number};

const insetFor = (reveal: number, from: 'right' | 'left' | 'top' | 'bottom' | 'center') => {
	const hidden = (1 - Math.max(0, Math.min(1, reveal))) * 100;
	switch (from) {
		case 'right':
			return `inset(0 0 0 ${hidden}%)`;
		case 'left':
			return `inset(0 ${hidden}% 0 0)`;
		case 'top':
			return `inset(0 0 ${hidden}% 0)`;
		case 'bottom':
			return `inset(${hidden}% 0 0 0)`;
		case 'center':
			return `inset(${hidden / 2}% ${hidden / 2}% ${hidden / 2}% ${hidden / 2}%)`;
	}
};

/**
 * A collage "clipping": a framed window onto a slot (real photo when one is
 * configured, otherwise the slot's editorial illustration). Geometry is in
 * the parent's pixel space; animate `rect` for morphs and match cuts.
 */
export const Clip: React.FC<{
	rect: Rect;
	slot: Slot;
	/** 0→1 clip-path reveal of the whole clipping. */
	reveal?: number;
	revealFrom?: 'right' | 'left' | 'top' | 'bottom' | 'center';
	/** Push-in on a detail: scale around a focus point (0–1 of the content). */
	zoom?: ClipZoom;
	/** White paper frame width in px (0 = borderless). */
	border?: number;
	/** 0–1 drop-shadow strength. */
	shadow?: number;
	tilt?: number;
	radius?: number;
	/** Color behind the content (visible while content fades in). */
	fill?: string;
	contentOpacity?: number;
	opacity?: number;
	/** Overlays drawn above the content, in clip-local px. */
	children?: React.ReactNode;
}> = ({
	rect,
	slot,
	reveal = 1,
	revealFrom = 'right',
	zoom,
	border = 8,
	shadow = 1,
	tilt = 0,
	radius = 3,
	fill = COLORS.mist,
	contentOpacity = 1,
	opacity = 1,
	children,
}) => {
	if (reveal <= 0 || opacity <= 0) return null;
	const photo = PHOTOS[slot];
	const z = zoom ?? {scale: 1, x: 0.5, y: 0.5};
	return (
		<div
			style={{
				position: 'absolute',
				left: rect.x,
				top: rect.y,
				width: rect.w,
				height: rect.h,
				transform: tilt ? `rotate(${tilt}deg)` : undefined,
				opacity,
				clipPath: reveal < 1 ? insetFor(reveal, revealFrom) : undefined,
				padding: border,
				boxSizing: 'border-box',
				background: border > 0 ? COLORS.white : 'transparent',
				borderRadius: radius + (border > 0 ? 2 : 0),
				boxShadow:
					shadow > 0
						? `0 ${20 * shadow}px ${48 * shadow}px rgba(24, 43, 69, ${0.16 * shadow}), 0 ${2 * shadow}px ${6 * shadow}px rgba(24, 43, 69, ${0.08 * shadow})`
						: undefined,
			}}
		>
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					borderRadius: radius,
					background: fill,
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						opacity: contentOpacity,
						transform: `scale(${z.scale})`,
						transformOrigin: `${z.x * 100}% ${z.y * 100}%`,
					}}
				>
					{photo ? (
						<Img
							src={staticFile(photo)}
							style={{width: '100%', height: '100%', objectFit: 'cover'}}
						/>
					) : (
						<Illustration slot={slot} />
					)}
				</div>
				{children}
			</div>
		</div>
	);
};
