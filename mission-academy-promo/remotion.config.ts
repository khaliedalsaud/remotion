import fs from 'fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

const preinstalled =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(preinstalled)) {
	Config.setBrowserExecutable(preinstalled);
}
