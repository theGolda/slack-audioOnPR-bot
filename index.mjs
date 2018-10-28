// botID: BDQ2NDG0K
import Bot from 'slackbots';
import { BOT_CONFIG } from './configs/slackBotConfig';
import { spawn } from 'child_process';

const SlackBot = new Bot(BOT_CONFIG);
const file = './assets/sounds/AITheme0.mp3';

SlackBot.on('start', () => {
  const mplayer = spawn('mplayer', [file]);
  mplayer.on('exit', () => console.log('exit'));
});