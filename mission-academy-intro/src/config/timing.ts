export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 1800;

export type SceneId = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';

export const SCENES: Record<SceneId, {from: number; duration: number; name: string}> = {
	s1: {from: 0, duration: 150, name: '1 · كيف تتحول المعرفة إلى ممارسة؟'},
	s2: {from: 150, duration: 210, name: '2 · تعلّم. طبّق. تطوّر.'},
	s3: {from: 360, duration: 360, name: '3 · تدريب صحي وتطوير مهني'},
	s4: {from: 720, duration: 300, name: '4 · مسارات تتكامل'},
	s5: {from: 1020, duration: 270, name: '5 · المعرفة تنمو بالمشاركة'},
	s6: {from: 1290, duration: 240, name: '6 · من المعرفة… إلى الممارسة'},
	s7: {from: 1530, duration: 150, name: '7 · أكاديمية ميشن'},
	s8: {from: 1680, duration: 120, name: '8 · البطاقة الختامية'},
};

/** Global frame → frame local to a scene's <Sequence>. */
export const local = (scene: SceneId, globalFrame: number) =>
	globalFrame - SCENES[scene].from;
