import {measureText} from '@remotion/layout-utils';
import {FONT_AR} from './config/brand';

/**
 * Rendered width of a run of text (Arabic shaping included). Only call from
 * components mounted behind useFontsReady(), or the width is for a fallback
 * font and gets cached.
 */
export const textWidth = (
	text: string,
	fontSize: number,
	fontWeight: number = 700,
	fontFamily: string = FONT_AR,
) => measureText({text, fontFamily, fontSize, fontWeight, validateFontIsLoaded: false}).width;
