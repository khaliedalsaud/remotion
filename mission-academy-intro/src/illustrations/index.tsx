import type {Slot} from '../config/assets';
import apply, {focus as applyFocus} from './apply';
import audience, {focus as audienceFocus} from './audience';
import conference, {focus as conferenceFocus} from './conference';
import discussion, {focus as discussionFocus} from './discussion';
import education, {focus as educationFocus} from './education';
import interaction, {focus as interactionFocus} from './interaction';
import knowledge, {focus as knowledgeFocus} from './knowledge';
import learning, {focus as learningFocus} from './learning';
import practice, {focus as practiceFocus} from './practice';
import practitioner, {focus as practitionerFocus} from './practitioner';
import research, {focus as researchFocus} from './research';
import skill, {focus as skillFocus} from './skill';
import training, {focus as trainingFocus} from './training';
import workshop, {focus as workshopFocus} from './workshop';

type Entry = {Component: React.FC; focus: Record<string, readonly [number, number]>};

export const ILLUSTRATIONS: Record<Slot, Entry> = {
	training: {Component: training, focus: trainingFocus},
	learning: {Component: learning, focus: learningFocus},
	practice: {Component: practice, focus: practiceFocus},
	interaction: {Component: interaction, focus: interactionFocus},
	practitioner: {Component: practitioner, focus: practitionerFocus},
	knowledge: {Component: knowledge, focus: knowledgeFocus},
	skill: {Component: skill, focus: skillFocus},
	apply: {Component: apply, focus: applyFocus},
	education: {Component: education, focus: educationFocus},
	research: {Component: research, focus: researchFocus},
	conference: {Component: conference, focus: conferenceFocus},
	discussion: {Component: discussion, focus: discussionFocus},
	workshop: {Component: workshop, focus: workshopFocus},
	audience: {Component: audience, focus: audienceFocus},
};

export const Illustration: React.FC<{slot: Slot}> = ({slot}) => {
	const {Component} = ILLUSTRATIONS[slot];
	return <Component />;
};

/** A named focus point of a slot's illustration, as 0–1 content coords. */
export const focusPoint = (slot: Slot, key: string): {x: number; y: number} => {
	const f = ILLUSTRATIONS[slot].focus[key] ?? [0.5, 0.5];
	return {x: f[0], y: f[1]};
};
