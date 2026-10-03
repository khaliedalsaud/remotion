import {AbsoluteFill} from 'remotion';
import {Clip} from './components/Clip';
import {Paper} from './components/Paper';
import {SLOTS, Slot} from './config/assets';
import {COLORS, FONT_EN} from './config/brand';
import {useFontsReady} from './fonts';
import {Illustration} from './illustrations';

/** Dev preview: one illustration at full 1200×1200. */
export const IllustrationPreview: React.FC<{slot: Slot}> = ({slot}) => (
	<AbsoluteFill>
		<Illustration slot={slot} />
	</AbsoluteFill>
);

/** Dev preview: every slot as a clipping, in a landscape and a portrait crop. */
export const IllustrationSheet: React.FC = () => {
	const ready = useFontsReady();
	const cols = 5;
	return (
		<AbsoluteFill>
			<Paper />
			{SLOTS.map((slot, i) => {
				const col = i % cols;
				const row = Math.floor(i / cols);
				const x = 1780 - (col + 1) * 330 + 10;
				const y = 60 + row * 330;
				return (
					<div key={slot}>
						<Clip rect={{x, y, w: 300, h: 220}} slot={slot} border={6} />
						{ready ? (
							<div style={{position: 'absolute', left: x, top: y + 228, fontFamily: FONT_EN, fontSize: 22, color: COLORS.ink, direction: 'ltr'}}>
								{slot}
							</div>
						) : null}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
