// Procedurally synthesised, license-free transition sounds (48 kHz mono WAV).
// Deterministic: re-running produces identical files.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SR = 48000;

const rng = (seed) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const pinkNoise = (n, seed) => {
	const r = rng(seed);
	const out = new Float32Array(n);
	let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
	for (let i = 0; i < n; i++) {
		const w = r() * 2 - 1;
		b0 = 0.99886 * b0 + w * 0.0555179;
		b1 = 0.99332 * b1 + w * 0.0750759;
		b2 = 0.969 * b2 + w * 0.153852;
		b3 = 0.8665 * b3 + w * 0.3104856;
		b4 = 0.55 * b4 + w * 0.5329522;
		b5 = -0.7616 * b5 - w * 0.016898;
		out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
		b6 = w * 0.115926;
	}
	return out;
};

/** Chamberlin state-variable band-pass with a time-varying center frequency. */
const bandpass = (x, fcAt, q = 0.7) => {
	const out = new Float32Array(x.length);
	let low = 0, band = 0;
	for (let i = 0; i < x.length; i++) {
		const f = 2 * Math.sin((Math.PI * Math.min(fcAt(i / SR), SR / 7)) / SR);
		low += f * band;
		const high = x[i] - low - q * band;
		band += f * high;
		out[i] = band;
	}
	return out;
};

const env = (t, attack, release, total) => {
	if (t < attack) return Math.pow(t / attack, 2);
	const r = (t - attack) / Math.max(1e-6, total - attack);
	return Math.pow(Math.max(0, 1 - r), release);
};

const normalize = (x, peakDb) => {
	let peak = 0;
	for (const v of x) peak = Math.max(peak, Math.abs(v));
	const g = Math.pow(10, peakDb / 20) / (peak || 1);
	return x.map((v) => v * g);
};

const fade = (x, ms = 4) => {
	const n = Math.floor((SR * ms) / 1000);
	for (let i = 0; i < n; i++) {
		x[i] *= i / n;
		x[x.length - 1 - i] *= i / n;
	}
	return x;
};

const writeWav = (name, samples) => {
	const data = Buffer.alloc(samples.length * 2);
	samples.forEach((v, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 2));
	const h = Buffer.alloc(44);
	h.write('RIFF', 0);
	h.writeUInt32LE(36 + data.length, 4);
	h.write('WAVE', 8);
	h.write('fmt ', 12);
	h.writeUInt32LE(16, 16);
	h.writeUInt16LE(1, 20);
	h.writeUInt16LE(1, 22);
	h.writeUInt32LE(SR, 24);
	h.writeUInt32LE(SR * 2, 28);
	h.writeUInt16LE(2, 32);
	h.writeUInt16LE(16, 34);
	h.write('data', 36);
	h.writeUInt32LE(data.length, 40);
	fs.writeFileSync(path.join(root, 'public/sfx', `${name}.wav`), Buffer.concat([h, data]));
};

const make = (seconds, fn) => {
	const n = Math.floor(SR * seconds);
	const out = new Float32Array(n);
	for (let i = 0; i < n; i++) out[i] = fn(i / SR, i);
	return out;
};

// whoosh — soft air sweep for larger moves.
{
	const d = 0.75;
	const n = Math.floor(SR * d);
	const bp = bandpass(pinkNoise(n, 11), (t) => 280 + 2200 * Math.sin(Math.PI * Math.min(1, t / d)) ** 1.5, 0.9);
	writeWav('whoosh', fade(normalize(bp.map((v, i) => v * env(i / SR, 0.3, 1.6, d)), -9)));
}
// swipe — short, light travel sound.
{
	const d = 0.36;
	const n = Math.floor(SR * d);
	const bp = bandpass(pinkNoise(n, 23), (t) => 1100 + 3000 * (t / d), 1.1);
	writeWav('swipe', fade(normalize(bp.map((v, i) => v * env(i / SR, 0.09, 2.2, d)), -12)));
}
// tick — soft wooden tock for highlights and callouts.
writeWav(
	'tick',
	fade(
		normalize(
			make(0.11, (t) => Math.exp(-t / 0.018) * (Math.sin(2 * Math.PI * 1250 * t) + 0.35 * Math.sin(2 * Math.PI * 2650 * t))),
			-14,
		),
		1,
	),
);
// pop — rounded node pop with a small pitch drop.
writeWav(
	'pop',
	fade(
		normalize(
			make(0.14, (t) => {
				const f = 520 + 420 * Math.exp(-t / 0.02);
				return Math.exp(-t / 0.035) * Math.sin(2 * Math.PI * f * t);
			}),
			-13,
		),
		1,
	),
);
// paper — a clipping sliding onto paper.
{
	const d = 0.42;
	const n = Math.floor(SR * d);
	const r = rng(41);
	const noise = pinkNoise(n, 37);
	const grain = new Float32Array(n);
	let g = 0;
	for (let i = 0; i < n; i++) {
		if (i % 220 === 0) g = 0.55 + 0.45 * r();
		grain[i] = g;
	}
	const bp = bandpass(noise, (t) => 3200 - 1200 * (t / d), 0.6);
	writeWav('paper', fade(normalize(bp.map((v, i) => v * grain[i] * env(i / SR, 0.04, 1.8, d)), -14)));
}
// swell — understated resolve under the logo (major triad + air).
{
	const d = 1.8;
	const n = Math.floor(SR * d);
	const air = bandpass(pinkNoise(n, 53), () => 2400, 1.4);
	const notes = [392.0, 493.88, 587.33, 783.99];
	writeWav(
		'swell',
		fade(
			normalize(
				make(d, (t, i) => {
					const e = env(t, 0.55, 2.4, d);
					const tone = notes.reduce((acc, f, k) => acc + Math.sin(2 * Math.PI * f * t) * (1 - k * 0.18), 0);
					return e * (tone * 0.22 + air[i] * 0.28);
				}),
				-15,
			),
			8,
		),
	);
}
console.log('sfx written');
