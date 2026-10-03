import {Composition} from 'remotion';
import {MissionAcademyPromo, PROMO_DURATION} from './MissionAcademyPromo';
import {defaultPromoProps, promoSchema} from './schema';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MissionAcademyPromo"
				component={MissionAcademyPromo}
				durationInFrames={PROMO_DURATION}
				fps={30}
				width={1920}
				height={1080}
				schema={promoSchema}
				defaultProps={defaultPromoProps}
			/>
			<Composition
				id="MissionAcademyPromoVertical"
				component={MissionAcademyPromo}
				durationInFrames={PROMO_DURATION}
				fps={30}
				width={1080}
				height={1920}
				schema={promoSchema}
				defaultProps={defaultPromoProps}
			/>
		</>
	);
};
