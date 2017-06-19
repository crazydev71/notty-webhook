import * as mongoose from 'mongoose';

const webhookScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    // ref: 'User'
  },
  
  name: String,

  description: String,

  url: String,

  channel: [{
    channelName: String,
    isEnabled: Boolean,
    config: mongoose.Schema.Types.Mixed
  }], 
  
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'Event'
  }]
});

const Webhook = mongoose.model('Webhook', webhookScheme);

export default Webhook;
