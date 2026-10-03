import {Composition, Folder} from 'remotion';
import {SLOTS} from './config/assets';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './config/timing';
import {IllustrationPreview, IllustrationSheet} from './Gallery';
import {IntroProps, MissionAcademyIntro} from './MissionAcademyIntro';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="MissionAcademyIntro"
			component={MissionAcademyIntro}
			durationInFrames={TOTAL_FRAMES}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
			defaultProps={{captions: true, sfx: true} satisfies IntroProps}
		/>
		<Folder name="dev">
			<Composition
				id="IllustrationSheet"
				component={IllustrationSheet}
				durationInFrames={1}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
			/>
			{SLOTS.map((slot) => (
				<Composition
					key={slot}
					id={`illustration-${slot}`}
					component={IllustrationPreview}
					durationInFrames={1}
					fps={FPS}
					width={1200}
					height={1200}
					defaultProps={{slot}}
				/>
			))}
		</Folder>
	</>
);
