import Bot from 'slackbots';
import { BOT_CONFIG } from './configs/slackBotConfig';
import { spawn } from 'child_process';
import cron from 'node-cron';

const SlackBot = new Bot(BOT_CONFIG);
const assetsPath = './assets/sounds/';
const teamChannel = 'general';
const startMessage = 'AudioOnPR bot is on. Sound will be played whenever new pull request is created.'
const botIdToFollow = 'BEBPDV2P6';
const prDailyHistory = [];

function isPullRequestMessage(data) {
  return data.subtype === 'bot_message' && data.bot_id === botIdToFollow;
}

function playSound(soundName) {
  spawn('mplayer', [`${assetsPath}${soundName}.mp3`]);
}

function handleNewPullRequest(prType) {
  const currentHour = checkTime();
}

function checkTime() {
  const nowTime = new Date();
  const isDST = nowTime.getTimezoneOffset < 0;

  return isDST ? nowTime.getHours() + 1 : nowTime.getHours();
}

SlackBot.on('start', () => {
  SlackBot.postMessageToChannel(
    teamChannel,
    startMessage
    )
});

SlackBot.on('message', (data) => {
  if (!isPullRequestMessage(data)) return;
  const prTypes = ['bug', 'feature'];

  for (let type of prTypes) {
    if (!data.attachments[0].fields[0].value.includes(type)) continue;
    handleNewPullRequest(type);
    break;
  }

})