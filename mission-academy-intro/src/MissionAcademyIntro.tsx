import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './components/Captions';
import {Paper} from './components/Paper';
import {SfxEnabled} from './components/Sfx';
import {MUSIC, VOICEOVER_AUDIO} from './config/assets';
import {COLORS, FONT_AR, WEIGHT} from './config/brand';
import {SCENES} from './config/timing';
import {useFontsReady} from './fonts';
import {IllustrationClock} from './illustrations/kit';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';
import {Scene7} from './scenes/Scene7';
import {Scene8} from './scenes/Scene8';

export type IntroProps = {captions: boolean; sfx: boolean};

const ORDER = [
	['s1', Scene1],
	['s2', Scene2],
	['s3', Scene3],
	['s4', Scene4],
	['s5', Scene5],
	['s6', Scene6],
	['s7', Scene7],
	['s8', Scene8],
] as const;

export const MissionAcademyIntro: React.FC<IntroProps> = ({captions, sfx}) => {
	const frame = useCurrentFrame();
	const fontsReady = useFontsReady();
	return (
		<IllustrationClock.Provider value={frame}>
			<SfxEnabled.Provider value={sfx}>
				<AbsoluteFill
					style={{
						direction: 'rtl',
						fontFamily: FONT_AR,
						fontWeight: WEIGHT.body,
						color: COLORS.ink,
					}}
				>
					<Paper />
					{fontsReady
						? ORDER.map(([id, Scene]) => (
								<Sequence key={id} from={SCENES[id].from} durationInFrames={SCENES[id].duration} name={SCENES[id].name}>
									<Scene />
								</Sequence>
							))
						: null}
					{fontsReady && captions ? <Captions /> : null}
					{VOICEOVER_AUDIO ? <Html5Audio src={staticFile(VOICEOVER_AUDIO)} /> : null}
					{MUSIC.src ? <Html5Audio src={staticFile(MUSIC.src)} volume={MUSIC.volume} /> : null}
				</AbsoluteFill>
			</SfxEnabled.Provider>
		</IllustrationClock.Provider>
	);
};
