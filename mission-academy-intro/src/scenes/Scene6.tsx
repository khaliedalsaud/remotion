// Scene 6 (43–51s) — «من المعرفة… إلى الممارسة.»
// The answer to Scene 1's question, in Scene 1's layout. The network's last dot
// sets off and draws the underline beneath «المعرفة…»; its leading edge runs on
// and unfolds the opening's training window again. On «الممارسة» the thread
// drops to the new word, still tied to the window, and the window opens out.
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {Clip} from '../components/Clip';
import {Sfx} from '../components/Sfx';
import {COLORS, THREAD} from '../config/brand';
import {HANDOFF} from '../config/layout';
import {cue} from '../config/script';
import {EASE, mix, mixRect, prog, Rect} from '../motion';
import {OPEN_RECT, TAG, Tagline, taglineSpans} from './scene6-tagline';

const DOT = HANDOFF.s5s6Dot;
const WIN = HANDOFF.s1s2Window;

export const Scene6: React.FC = () => {
	const frame = useCurrentFrame();
	const jCue = cue('s6', 'journey');
	const kCue = cue('s6', 'knowledge');
	const pCue = cue('s6', 'practice');
	const th = THREAD.width;
	const {knowledge: K, practice: P} = taglineSpans();

	// 1. On «رحلة» the dot sets off to the start of the underline.
	const glide = prog(frame, jCue - 6, 18, EASE.inOut);
	// 2. It draws beneath «المعرفة…» (right → left) as the word is spoken.
	const draw = prog(frame, kCue - 18, 20, EASE.out);
	const thin = prog(frame, kCue - 18, 8, EASE.out);
	// 3. The leading edge runs on to the opening's window and unfolds it.
	const run = prog(frame, kCue + 4, 18, EASE.inOut);
	const unfold = prog(frame, kCue + 20, 22, EASE.inOut);
	const reveal = prog(frame, kCue + 26, 12, EASE.out);
	// 4. On «الممارسة» the thread drops to the new word, still tied to the window…
	const reach = prog(frame, pCue - 14, 18, EASE.inOut);
	const drop = prog(frame, pCue - 10, 16, EASE.inOut);
	// 5. …and the window opens out into a full-height picture of practice.
	const open = prog(frame, pCue + 2, 32, EASE.inOut);

	const dotX = mix(DOT.x, K.right - DOT.r, glide);
	const h = mix(DOT.r * 2, th, thin);
	let left = mix(dotX - DOT.r, K.left, draw);
	left = mix(left, WIN.x, run);
	const right = mix(dotX + DOT.r, P.right, reach);
	const y = mix(TAG.underA, TAG.underB, drop);

	const seg: Rect = {x: WIN.x, y: TAG.underA - th / 2, w: WIN.w, h: th};
	const win = mixRect(mixRect(seg, WIN, unfold), OPEN_RECT, open);
	// Once the window has lifted out of it, the thread starts at the window's edge.
	if (unfold > 0) left = win.x + win.w - th;

	const zoom = mix(1.22, 1, prog(frame, kCue + 20, 32, EASE.out));
	const practiceColor = interpolateColors(
		prog(frame, pCue - 6, 10, EASE.out),
		[0, 1],
		[COLORS.ink, COLORS.primary],
	);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left,
					width: Math.max(h, right - left),
					top: y - h / 2,
					height: h,
					borderRadius: h / 2,
					background: THREAD.color,
				}}
			/>
			{unfold > 0 ? (
				<Clip
					rect={win}
					slot="training"
					border={mix(0, 8, reveal)}
					shadow={reveal}
					radius={mix(th / 2, 3, unfold)}
					fill={COLORS.primary}
					contentOpacity={reveal}
					zoom={{scale: zoom, x: 0.55, y: 0.45}}
				/>
			) : null}
			<Tagline start={4} practiceColor={practiceColor} />
			<Sfx at={jCue - 6} name="swipe" volume={0.3} />
			<Sfx at={kCue - 18} name="tick" volume={0.45} />
			<Sfx at={kCue + 4} name="swipe" volume={0.4} />
			<Sfx at={kCue + 22} name="paper" volume={0.55} />
			<Sfx at={pCue - 14} name="swipe" volume={0.35} />
			<Sfx at={pCue + 2} name="whoosh" volume={0.45} />
		</AbsoluteFill>
	);
};
