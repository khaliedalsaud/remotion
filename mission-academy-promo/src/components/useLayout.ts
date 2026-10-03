import {useVideoConfig} from 'remotion';

export const useLayout = () => {
	const {width, height} = useVideoConfig();
	const vertical = height > width;
	// Scale relative to the 1920x1080 design.
	const s = vertical ? width / 1080 : height / 1080;
	return {vertical, s, width, height};
};
