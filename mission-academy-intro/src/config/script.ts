import {SceneId, SCENES} from './timing';

// On-screen text. Keep titles short (3–7 words) — this is the editable layer.
export const TEXT = {
	s1: {line1: 'كيف تتحول', knowledge: 'المعرفة', to: 'إلى', practice: 'ممارسة؟'},
	s2: {learn: 'تعلّم.', apply: 'طبّق.', grow: 'تطوّر.'},
	s3: {
		title: ['تدريب صحي', 'وتطوير مهني'],
		notes: {knowledge: 'معرفة', skill: 'مهارة', apply: 'تطبيق'},
	},
	s4: {
		title: 'مسارات تتكامل',
		tracks: ['التعليم والتدريب', 'البحث العلمي', 'المؤتمرات والفعاليات'],
	},
	s5: {
		title: ['المعرفة تنمو', 'بالمشاركة'],
		notes: ['نقاش', 'ورشة عمل', 'متحدثون', 'حضور'],
	},
	s6: {from: 'من', knowledge: 'المعرفة…', to: 'إلى', practice: 'الممارسة.'},
	s7: {nameAr: 'أكاديمية ميشن', nameEn: 'Mission Academy'},
	s8: {cta: 'تعرّف على برامجنا ومجالات التعاون', website: 'new.missionacademy.sa'},
} as const;

export type CaptionChunk = {text: string; from: number; to: number};
export type VoLine = {scene: SceneId; text: string; chunks: CaptionChunk[]};

// Proposed voice-over with TARGET timings (global frames @30fps). No recording
// exists yet: after recording, re-time these chunks to the real audio — the
// captions and the exported SRT both read from here.
export const VOICEOVER: VoLine[] = [
	{
		scene: 's1',
		text: 'في القطاع الصحي، كيف تتحول المعرفة إلى ممارسة؟',
		chunks: [
			{text: 'في القطاع الصحي،', from: 12, to: 44},
			{text: 'كيف تتحول المعرفة إلى ممارسة؟', from: 44, to: 122},
		],
	},
	{
		scene: 's2',
		text: 'تبدأ بالتعلّم، وتنمو بالتطبيق، وتستمر بالتطوير. هنا يأتي دور أكاديمية ميشن.',
		chunks: [
			{text: 'تبدأ بالتعلّم،', from: 162, to: 198},
			{text: 'وتنمو بالتطبيق،', from: 198, to: 238},
			{text: 'وتستمر بالتطوير.', from: 238, to: 284},
			{text: 'هنا يأتي دور أكاديمية ميشن.', from: 288, to: 350},
		],
	},
	{
		scene: 's3',
		text: 'جهة تدريبية سعودية متخصصة في القطاع الصحي والتطوير المهني، تعمل على تأهيل الممارسين، وتطوير معارفهم ومهاراتهم.',
		chunks: [
			{text: 'جهة تدريبية سعودية', from: 368, to: 410},
			{text: 'متخصصة في القطاع الصحي والتطوير المهني،', from: 410, to: 498},
			{text: 'تعمل على تأهيل الممارسين،', from: 502, to: 552},
			{text: 'وتطوير معارفهم ومهاراتهم.', from: 556, to: 620},
		],
	},
	{
		scene: 's4',
		text: 'من التعليم والتدريب، إلى البحث العلمي، والمؤتمرات والفعاليات؛ مسارات تتكامل لدعم التطوير المهني.',
		chunks: [
			{text: 'من التعليم والتدريب،', from: 735, to: 778},
			{text: 'إلى البحث العلمي،', from: 782, to: 822},
			{text: 'والمؤتمرات والفعاليات؛', from: 826, to: 876},
			{text: 'مسارات تتكامل لدعم التطوير المهني.', from: 884, to: 962},
		],
	},
	{
		scene: 's5',
		text: 'وبالتعاون مع الجهات الصحية والتعليمية، تفتح ميشن مساحة لتبادل الخبرات، والتعلّم، وبناء الشراكات.',
		chunks: [
			{text: 'وبالتعاون مع الجهات الصحية والتعليمية،', from: 1026, to: 1106},
			{text: 'تفتح ميشن مساحة لتبادل الخبرات،', from: 1110, to: 1174},
			{text: 'والتعلّم، وبناء الشراكات.', from: 1178, to: 1240},
		],
	},
	{
		scene: 's6',
		text: 'لأن التطوير المهني رحلة مستمرة، تجمع المعرفة بالتطبيق، وتمنح التعلّم معنى في الممارسة.',
		chunks: [
			{text: 'لأن التطوير المهني رحلة مستمرة،', from: 1302, to: 1366},
			{text: 'تجمع المعرفة بالتطبيق،', from: 1370, to: 1422},
			{text: 'وتمنح التعلّم معنى في الممارسة.', from: 1426, to: 1490},
		],
	},
	{
		scene: 's7',
		text: 'أكاديمية ميشن. من المعرفة… إلى الممارسة.',
		chunks: [
			{text: 'أكاديمية ميشن.', from: 1545, to: 1584},
			{text: 'من المعرفة… إلى الممارسة.', from: 1590, to: 1658},
		],
	},
];

// Approximate GLOBAL frames where key words are spoken — visual emphasis
// (highlights, callouts, node reveals) is timed to these.
export const CUES = {
	s1: {knowledge: 76, practice: 102},
	s2: {learn: 176, apply: 214, grow: 256, mission: 330},
	s3: {health: 460, professional: 490, practitioners: 540, knowledge: 584, skills: 606},
	s4: {education: 748, research: 798, events: 846, integrate: 906},
	s5: {partners: 1062, exchange: 1150, learning: 1180, partnerships: 1216},
	s6: {journey: 1350, knowledge: 1386, practice: 1466},
	s7: {name: 1562, knowledge: 1612, practice: 1644},
} as const;

/** A cue as a frame local to its scene's <Sequence>. */
export const cue = <S extends keyof typeof CUES>(scene: S, key: keyof (typeof CUES)[S]) =>
	(CUES[scene][key] as number) - SCENES[scene].from;
