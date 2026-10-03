import {FONT_EN} from '../config/brand';

/** Isolates Latin text, URLs and numbers inside the RTL flow. */
export const Ltr: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
	children,
	style,
}) => (
	<span dir="ltr" style={{direction: 'ltr', unicodeBidi: 'isolate', fontFamily: FONT_EN, ...style}}>
		{children}
	</span>
);
