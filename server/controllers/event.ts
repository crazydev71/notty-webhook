import * as mongoose from 'mongoose';
import BaseCtrl from './base';

import User from '../models/user';
import Webhook from '../models/webhook';
import Event from '../models/event';

export default class EventCtrl{
  model = Event;

// Get All Events
  getAll = (req, res) => {
  	this.model.find({user: req.params.user}).populate('webhook').exec((err, docs) => {
  		if (err) { return console.error(err); }
  		res.json(docs);
  	});
  };

// Get a Event
  get = (req, res) => {
  	this.model.findOne({user: req.params.user, webhook: req.params.webhook, _id: req.params.id}).exec((err, obj) => {
  		if (err) {return console.error(err);}
  		res.json(obj);
  	});
  };

// Get Events in a Webhook
  getEventsInWebhook = (req, res) => {
  	this.model.find({user: req.params.user, webhook: req.params.webhook}, (err, docs) => {
			if (err) { return console.error(err); }
			res.json(docs);
  	})
  }

// Delete Event
  delete = (req, res) => {
  	this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
  		if (err) { return console.error(err); }
  		res.sendStatus(200);
  	});
  };
}
