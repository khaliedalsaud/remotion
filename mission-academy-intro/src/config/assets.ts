// Every visual "clipping" in the film reads from a slot. A slot shows a real
// photo when a path is set (relative to public/, e.g. 'images/training.jpg'),
// otherwise its abstract editorial illustration. No academy photos were
// supplied, so all slots currently use illustrations — deliberately abstract,
// so they are never mistaken for the academy's own facilities or events.
export const SLOTS = [
	'training',
	'learning',
	'practice',
	'interaction',
	'practitioner',
	'knowledge',
	'skill',
	'apply',
	'education',
	'research',
	'conference',
	'discussion',
	'workshop',
	'audience',
] as const;

export type Slot = (typeof SLOTS)[number];

export const PHOTOS: Record<Slot, string | null> = {
	training: null,
	learning: null,
	practice: null,
	interaction: null,
	practitioner: null,
	knowledge: null,
	skill: null,
	apply: null,
	education: null,
	research: null,
	conference: null,
	discussion: null,
	workshop: null,
	audience: null,
};

/** Recorded narration (relative to public/), aligned to frame 0. */
export const VOICEOVER_AUDIO: string | null = null;

/** Licensed music bed (relative to public/). */
export const MUSIC: {src: string | null; volume: number} = {src: null, volume: 0.12};

export const SFX_FILES = {
	whoosh: 'sfx/whoosh.wav',
	swipe: 'sfx/swipe.wav',
	tick: 'sfx/tick.wav',
	paper: 'sfx/paper.wav',
	pop: 'sfx/pop.wav',
	swell: 'sfx/swell.wav',
} as const;

export type SfxName = keyof typeof SFX_FILES;

export const SFX_MASTER_VOLUME = 0.55;
