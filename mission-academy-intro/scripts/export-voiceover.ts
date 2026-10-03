// Writes the narration script, timings and an SRT from src/config/script.ts —
// the same source the burned-in captions use. Run: npm run captions
import fs from 'node:fs';
import path from 'node:path';
import {CUES, TEXT, VOICEOVER} from '../src/config/script';
import {FPS, SCENES} from '../src/config/timing';

const out = path.resolve(__dirname, '../voiceover');
fs.mkdirSync(out, {recursive: true});

const ts = (frame: number, sep = ',') => {
	const ms = Math.round((frame / FPS) * 1000);
	const h = Math.floor(ms / 3600000);
	const m = Math.floor((ms % 3600000) / 60000);
	const s = Math.floor((ms % 60000) / 1000);
	const pad = (n: number, w = 2) => String(n).padStart(w, '0');
	return `${pad(h)}:${pad(m)}:${pad(s)}${sep}${pad(ms % 1000, 3)}`;
};
const sec = (frame: number) => (frame / FPS).toFixed(2);

const chunks = VOICEOVER.flatMap((l) => l.chunks);
fs.writeFileSync(
	path.join(out, 'captions.srt'),
	chunks.map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.to)}\n${c.text}\n`).join('\n'),
);

fs.writeFileSync(
	path.join(out, 'timings.json'),
	JSON.stringify(
		{
			fps: FPS,
			scenes: SCENES,
			voiceover: VOICEOVER.map((l) => ({
				...l,
				startSeconds: Number(sec(l.chunks[0].from)),
				endSeconds: Number(sec(l.chunks[l.chunks.length - 1].to)),
			})),
			emphasisCues: CUES,
		},
		null,
		2,
	) + '\n',
);

const sceneRows = (Object.keys(SCENES) as Array<keyof typeof SCENES>).map((id) => {
	const sc = SCENES[id];
	const line = VOICEOVER.find((l) => l.scene === id);
	const window = line ? `${sec(line.chunks[0].from)}–${sec(line.chunks[line.chunks.length - 1].to)} ث` : '—';
	return `| ${sc.name} | ${sec(sc.from)}–${sec(sc.from + sc.duration)} ث | ${window} | ${line ? line.text : '— (بلا تعليق صوتي)'} |`;
});

const md = `# نص التعليق الصوتي — أكاديمية ميشن (60 ثانية)

> **حالة التسجيل:** لم يُسجَّل تعليق صوتي بعد. النسخة المصدَّرة صامتة من التعليق (مع مؤثرات انتقال خفيفة)، والترجمة العربية مدمجة بالتوقيتات المستهدفة أدناه.

## توجيهات الأداء
- عربية بيضاء قريبة من الجمهور السعودي، نبرة واثقة وطبيعية، بلا مبالغة إعلانية.
- السرعة المستهدفة ≈ 2.3–2.7 كلمة/ثانية، مع وقفات قصيرة عند الفواصل.
- لا تُسرَّع التسجيلات لتطابق المشاهد: إن طال سطر، عدّل توقيتاته في \`src/config/script.ts\` (VOICEOVER) — الترجمة والملف SRT يقرآن من المصدر نفسه.
- الكلمات المُبرزة بصريًا (توقيت الإبراز في CUES): المعرفة، ممارسة، التعلّم، التطبيق، التطوير، أكاديمية ميشن، الصحي، المهني، الممارسين، معارفهم، مهاراتهم، التعليم والتدريب، البحث العلمي، المؤتمرات والفعاليات، تتكامل، الشراكات.

## الجدول الزمني
| المشهد | توقيت المشهد | نافذة التعليق | النص |
|---|---|---|---|
${sceneRows.join('\n')}

## مقاطع الترجمة (توقيت مستهدف)
| # | من | إلى | النص |
|---|---|---|---|
${chunks.map((c, i) => `| ${i + 1} | ${ts(c.from, '.')} | ${ts(c.to, '.')} | ${c.text} |`).join('\n')}

## النصوص الظاهرة على الشاشة
${Object.entries(TEXT)
	.map(([k, v]) => `- **${k}:** ${JSON.stringify(v, null, 0).replace(/[{}"[\]]/g, ' ').replace(/\s+/g, ' ').trim()}`)
	.join('\n')}

## إضافة التسجيل لاحقًا
1. ضع الملف في \`public/audio/voiceover.wav\` (يبدأ من الثانية 0).
2. اضبط \`VOICEOVER_AUDIO = 'audio/voiceover.wav'\` في \`src/config/assets.ts\`.
3. أعد توقيت مقاطع \`VOICEOVER\` على التسجيل الفعلي، ثم \`npm run captions\` و\`npm run render\`.
`;
fs.writeFileSync(path.join(out, 'voiceover-script.md'), md);
console.log('voiceover/: voiceover-script.md, captions.srt, timings.json');
