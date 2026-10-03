import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Emblem} from '../components/Emblem';
import {Reveal} from '../components/Reveal';
import {useLayout} from '../components/useLayout';
import type {PromoProps} from '../schema';
import {fontAr, fontEn} from '../theme';

export const CtaScene: React.FC<PromoProps> = (p) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {s} = useLayout();
	const btn = spring({frame: frame - 40, fps, config: {damping: 12}});
	const pulse = 1 + Math.max(0, Math.sin((frame - 60) / 7)) * 0.04 * (frame > 60 ? 1 : 0);
	const shine = interpolate((frame - 60) % 60, [0, 25], [-30, 130], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const url = spring({frame: frame - 60, fps, config: {damping: 200}});

	return (
		<AbsoluteFill
			style={{
				direction: 'rtl',
				fontFamily: fontAr,
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
			}}
		>
			<Emblem size={190 * s} primaryColor={p.primaryColor} accentColor={p.accentColor} />
			<Reveal delay={20} style={{marginTop: 30 * s}}>
				<div style={{fontSize: 110 * s, fontWeight: 700, color: 'white', lineHeight: 1.3}}>
					{p.ctaTitle}
				</div>
			</Reveal>
			<div
				style={{
					marginTop: 40 * s,
					position: 'relative',
					overflow: 'hidden',
					padding: `${22 * s}px ${80 * s}px`,
					borderRadius: 100,
					background: `linear-gradient(90deg, ${p.primaryColor}, ${p.primaryColor}DD)`,
					color: p.backgroundColor,
					fontSize: 52 * s,
					fontWeight: 700,
					transform: `scale(${btn * pulse})`,
					boxShadow: `0 20px 60px ${p.primaryColor}66`,
				}}
			>
				{p.ctaButton}
				<div
					style={{
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: `${shine}%`,
						width: '25%',
						background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
						transform: 'skewX(-20deg)',
					}}
				/>
			</div>
			<div
				style={{
					marginTop: 46 * s,
					fontFamily: fontEn,
					fontWeight: 600,
					fontSize: 38 * s,
					letterSpacing: 3 * s,
					color: p.accentColor,
					opacity: url,
					transform: `translateY(${(1 - url) * 20}px)`,
					direction: 'ltr',
				}}
			>
				{p.website}
			</div>
			<div
				style={{
					marginTop: 14 * s,
					fontSize: 32 * s,
					fontWeight: 500,
					color: 'rgba(255,255,255,0.7)',
					opacity: url,
				}}
			>
				{p.academyNameAr} · <span style={{fontFamily: fontEn, letterSpacing: 4 * s}}>{p.academyNameEn}</span>
			</div>
		</AbsoluteFill>
	);
};
