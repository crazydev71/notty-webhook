import * as mongoose from 'mongoose';

import User from '../models/user';
import Webhook from '../models/webhook';
import Event from '../models/event';

export default class HookHandler {

	receiveEvent =  (req, res) => {
	  const user = req.params.user, webhook = req.params.webhook;
	  const eventData = req.body, eventHeader = req.headers;
	  console.log(req.headers);
		const newEvent = new Event({user: user, webhook: webhook, headers: eventHeader, payloads: eventData});

	  newEvent.save((err, item) => {
	  	Webhook.findOne({_id: item.webhook}, (err, w) => {
	  		if(!err) {
	  			w.events.push(item._id);
	  			w.save();
	  		}
	  	});
	  });

	  return res.sendStatus(200);
	};
}