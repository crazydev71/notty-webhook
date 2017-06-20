import * as express from 'express';
import * as passport from 'passport';

import Cat from './models/cat';
import User from './models/user';
import Webhook from './models/webhook';
import Event from './models/event';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import WebhookCtrl from './controllers/webhook';
import EventCtrl from  './controllers/event';
import HookHandler from './controllers/hook-handler';

export default function setRoutes(app) {

  const router = express.Router();
  const hook = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
  const webhookCtrl = new WebhookCtrl();
  const eventCtrl = new EventCtrl();

  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/login').post(passport.authenticate('local'), userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(function(req, res, next){
     User.register(new User({ username : req.body.username, email: req.body.email, role: req.body.role}), req.body.password, 
       function(err, account) {
        if (err) {
            return res.status(400).json({msg: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login'); }
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json(req.user);
          });
        })(req, res, function () {
          return res.status(413).json({msg: "Something went wrong!"});   
        });
      });
  });
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Webhook
  router.route('/webhooks/:user').get(webhookCtrl.getAll);
  router.route('/webhook/:user').post(webhookCtrl.insert);
  router.route('/webhook/:user/:id').get(webhookCtrl.get);
  router.route('/webhook/:user/:id').put(webhookCtrl.update);
  router.route('/webhook/:user/:id').delete(webhookCtrl.delete);
  
  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

  // Hook api
  const hookHandler = new HookHandler();
  hook.route('/:user/:webhook').post(hookHandler.receiveEvent);
  app.use('/hook', hook)
}
