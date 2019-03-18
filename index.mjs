import Bot from 'slackbots';
import BOT_CONFIG from './configs/slackBotConfig';
import { spawn } from 'child_process';
import cron from 'node-cron';
import mongoose from 'mongoose';
import Developer from './models/developer';

const SlackBot = new Bot(BOT_CONFIG);
const assetsPath = './assets/sounds/'; // TODO: move to config
const teamChannel = 'general'; // TODO: move to config
const startMessage = 'AudioOnPR bot is on. Sound will be played whenever new pull request is created.'; // TODO: move to config
const botIdToFollow = 'BEBPDV2P6'; // TODO: move to config

const prTypes = ['bug', 'feature']; // TODO: move to config

mongoose.connect('mongodb://localhost/slackBotDB');
const db = mongoose.connection;
db.once('open', () => console.log('Connected to slackBotDB'));
db.on('error', (err) => console.log(err));

const developer = new Developer({
  _id: new mongoose.Types.ObjectId,
  slackId: 1,
  firstName: 'Joe',
  lastName: 'Doe',
  pullRequests: {
    dailyBugs: 0,
    dailyFeatures: 0,
    dailyTotal: 0,
    historyBugs: 0,
    historyFeatures: 0,
    historyTotal: 0
  }
});
developer.save().then(res => console.log('added new developer')).catch(err => console.log(err));
Developer.updateMany(
  {}, 
  {
    $inc:{'pullRequests.dailyBugs':1}
  }, 
  (err) => console.log('updated first name', err)
);


cron.schedule('59 59 23 * * *', () => { // TODO: move to separate SCHEDULER module
  // TODO: clear db every day at midnight
});

function isPullRequestMessage(prData) { // TODO: move to separate VALIDATOR module
  return prData.subtype === 'bot_message' && prData.bot_id === botIdToFollow;
}

function isPullRequestOfValidType(prData, prType) { // TODO: move to separate VALIDATOR module
  return prData.attachments[0].fields[0].value.includes(prType);
}

function playSound(soundName) { // TODO: move to separate SOUNDS module
  spawn('mplayer', [`${assetsPath}${soundName}.mp3`]);
}

function handleNewPullRequest(prData, prType) { // TODO: move to separate PULL REQUEST module
  const prPreText = prData.attachments[0].pretext;
  const prAuthor = prPreText.split(' ').slice(0, 2).join(' ');
  // TODO: check PR record

  // TODO: check what track to play

  // TODO: play sound
}

SlackBot.on('start', () => {
  SlackBot.postMessageToChannel(
    teamChannel,
    startMessage
  );
});

SlackBot.on('message', (data) => {
  if (!isPullRequestMessage(data)) return;
  console.log(data);
  for (let type of prTypes) {
    if (!isPullRequestOfValidType(data, type)) continue;
    handleNewPullRequest(data, type);
    break;
  }
});
