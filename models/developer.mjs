import mongoose from 'mongoose';

const developerSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  slackId: Number,
  firstName: String,
  lastName: String,
  pullRequests: {
    dailyBugs: Number,
    dailyFeatures: Number,
    dailyTotal: Number,
    historyBugs: Number,
    historyFeatures: Number,
    historyTotal: Number,
  }
});

export default mongoose.model('Developer', developerSchema);