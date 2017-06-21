import * as mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  user: {
  	type: mongoose.Schema.Types.ObjectId, 
  	ref: 'User'
  },

  webhook: {
  	type: mongoose.Schema.Types.ObjectId, 
  	ref: 'Webhook'
  },

  headers: {type: mongoose.Schema.Types.Mixed},
  
  payloads: {type: mongoose.Schema.Types.Mixed},

  created: {
  	type: Date, 
  	default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
