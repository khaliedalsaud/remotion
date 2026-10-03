import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {AbsoluteFill} from 'remotion';
import {Background} from './components/Background';
import {AboutScene} from './scenes/AboutScene';
import {CtaScene} from './scenes/CtaScene';
import {HookScene} from './scenes/HookScene';
import {IntroScene} from './scenes/IntroScene';
import {PillarsScene} from './scenes/PillarsScene';
import {StatsScene} from './scenes/StatsScene';
import type {PromoProps} from './schema';

const T = 15;
const SCENES = [90, 120, 135, 210, 150, 180];
export const PROMO_DURATION =
	SCENES.reduce((a, b) => a + b, 0) - T * (SCENES.length - 1);

const timing = linearTiming({durationInFrames: T});

export const MissionAcademyPromo: React.FC<PromoProps> = (props) => {
	return (
		<AbsoluteFill style={{backgroundColor: props.backgroundColor}}>
			<Background {...props} />
			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={SCENES[0]}>
					<IntroScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={timing} />
				<TransitionSeries.Sequence durationInFrames={SCENES[1]}>
					<HookScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-left'})}
					timing={timing}
				/>
				<TransitionSeries.Sequence durationInFrames={SCENES[2]}>
					<AboutScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={timing} />
				<TransitionSeries.Sequence durationInFrames={SCENES[3]}>
					<PillarsScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-left'})}
					timing={timing}
				/>
				<TransitionSeries.Sequence durationInFrames={SCENES[4]}>
					<StatsScene {...props} />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition presentation={fade()} timing={timing} />
				<TransitionSeries.Sequence durationInFrames={SCENES[5]}>
					<CtaScene {...props} />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
