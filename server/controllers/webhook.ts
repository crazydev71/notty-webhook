import * as mongoose from 'mongoose';
import BaseCtrl from './base';

import User from '../models/user';
import Webhook from '../models/webhook';
import Event from '../models/event';

export default class WebhookCtrl{
  model = Webhook;

// Get All Webhooks
  getAll = (req, res) => {
  	this.model.find({user: req.params.user}, (err, docs) => {
  		if (err) { return console.error(err); }
  		res.json(docs);
  	});
  };

// Get a Webhook
  get = (req, res) => {
  	this.model.findOne({user: req.params.user, _id: req.params.id}).populate('events').exec((err, obj) => {
  		if (err) {return console.error(err);}
  		res.json(obj);
  	});
  };

// Insert Webhook
  insert = (req, res) => {
  	const obj = new this.model(req.body);
  	obj.user = req.params.user;

  	obj.save((err, item) => {
  		if (err && err.code === 11000) {
  			res.sendStatus(400);
  		}
  		if (err) {
  			return console.error(err);
  		}
      item.url = req.protocol + '://' + req.get('host') + "/hook/" + item.user + '/' + item._id;
      item.save((err, saved) => {
        res.status(200).json(saved);
      })
  	});

  };

// Edit webhook
  update = (req, res) => {
  	this.model.findOneAndUpdate({user:req.params.user, _id: req.params.id}, req.body, (err, item) => {
  		if (err) { return console.error(err); }
  			res.json(item);
  	})
  };

  delete = (req, res) => {
  	this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
  		if (err) { return console.error(err); }
  		res.sendStatus(200);
  	});
  };
}
