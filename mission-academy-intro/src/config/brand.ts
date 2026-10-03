import logoMeta from './logo.generated.json';

// Brand direction from the brief. The logo mark's measured colors
// (#0041D1 / #002E7E) match primary / deep.
export const COLORS = {
	primary: '#0644CA',
	deep: '#06327A',
	white: '#FFFFFF',
	paper: '#F1F4F9',
	ink: '#182B45',
	// Supporting tints derived from primary, for illustration and soft accents.
	mid: '#3A6BD8',
	light: '#A8C0EF',
	pale: '#D6E2F8',
	mist: '#E8EEF9',
	inkSoft: '#5A6A82',
	line: 'rgba(24, 43, 69, 0.07)',
} as const;

export const FONT_AR = "'IBM Plex Sans Arabic', 'IBM Plex Sans', sans-serif";
export const FONT_EN = "'IBM Plex Sans', 'IBM Plex Sans Arabic', sans-serif";

export const WEIGHT = {
	body: 400,
	caption: 500,
	title: 600,
	display: 700,
} as const;

// The "knowledge thread": one stroke style everywhere it appears.
export const THREAD = {
	color: COLORS.primary,
	width: 10,
} as const;

export const LOGO = {
	src: 'brand/logo-mark@3x.png',
	// Native pixel size of the supplied mark (cropped). Avoid displaying it
	// much larger than ~1.4x this height: the source is a 255px JPEG.
	nativeWidth: logoMeta.width,
	nativeHeight: logoMeta.height,
	aspect: logoMeta.width / logoMeta.height,
	bars: logoMeta.bars,
} as const;
