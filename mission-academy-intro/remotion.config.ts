import fs from 'fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setConcurrency(3);

// Cloud sandbox ships a headless shell here; elsewhere Remotion downloads its own.
const preinstalled =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(preinstalled)) {
	Config.setBrowserExecutable(preinstalled);
}
