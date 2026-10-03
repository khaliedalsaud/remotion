import {zColor} from '@remotion/zod-types';
import {z} from 'zod';

export const promoSchema = z.object({
	academyNameAr: z.string(),
	academyNameEn: z.string(),
	hookLine1: z.string(),
	hookLine2: z.string(),
	aboutTitle: z.string(),
	aboutText: z.string(),
	pillars: z
		.array(z.object({title: z.string(), text: z.string()}))
		.length(4),
	stats: z
		.array(z.object({value: z.number(), suffix: z.string(), label: z.string()}))
		.length(3),
	ctaTitle: z.string(),
	ctaButton: z.string(),
	website: z.string(),
	primaryColor: zColor(),
	accentColor: zColor(),
	backgroundColor: zColor(),
});

export type PromoProps = z.infer<typeof promoSchema>;

// Placeholder copy: new.missionacademy.sa could not be reached when this was
// written. Replace with the academy's real programs and numbers.
export const defaultPromoProps: PromoProps = {
	academyNameAr: 'أكاديمية ميشن',
	academyNameEn: 'MISSION ACADEMY',
	hookLine1: 'كل إنجاز كبير',
	hookLine2: 'يبدأ بمهمة',
	aboutTitle: 'من نحن',
	aboutText:
		'أكاديمية سعودية تصنع الكفاءات وتؤهلها لسوق العمل عبر برامج تدريبية عملية بمعايير احترافية',
	pillars: [
		{title: 'برامج معتمدة', text: 'مسارات تدريبية بمعايير مهنية'},
		{title: 'مدربون خبراء', text: 'نخبة من أصحاب الخبرة الميدانية'},
		{title: 'تعلّم تطبيقي', text: 'مشاريع حقيقية من اليوم الأول'},
		{title: 'شهادات مهنية', text: 'تفتح لك أبواب الفرص'},
	],
	stats: [
		{value: 5000, suffix: '+', label: 'متدرب ومتدربة'},
		{value: 50, suffix: '+', label: 'برنامجًا تدريبيًا'},
		{value: 98, suffix: '%', label: 'نسبة رضا المتدربين'},
	],
	ctaTitle: 'ابدأ مهمتك اليوم',
	ctaButton: 'سجّل الآن',
	website: 'missionacademy.sa',
	primaryColor: '#F5B83D',
	accentColor: '#2EC4B6',
	backgroundColor: '#060D1F',
};
