"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var passport = require("passport");
var user_1 = require("./models/user");
var cat_1 = require("./controllers/cat");
var user_2 = require("./controllers/user");
var webhook_1 = require("./controllers/webhook");
var event_1 = require("./controllers/event");
var hook_handler_1 = require("./controllers/hook-handler");
function setRoutes(app) {
    var router = express.Router();
    var hook = express.Router();
    var catCtrl = new cat_1.default();
    var userCtrl = new user_2.default();
    var webhookCtrl = new webhook_1.default();
    var eventCtrl = new event_1.default();
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
    router.route('/user').post(function (req, res, next) {
        user_1.default.register(new user_1.default({ username: req.body.username, email: req.body.email, role: req.body.role }), req.body.password, function (err, account) {
            if (err) {
                return res.status(400).json({ msg: "Sorry. That username already exists. Try again." });
            }
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect('/login');
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.json(req.user);
                });
            })(req, res, function () {
                return res.status(413).json({ msg: "Something went wrong!" });
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
    // Event
    router.route('/events/:user').get(eventCtrl.getAll);
    router.route('/events/:user/:webhook').get(eventCtrl.getEventsInWebhook);
    router.route('/event/:user/:webhook/:id').get(eventCtrl.get);
    // router.route('/event/:user/:webhook').post(eventCtrl.insert);
    // router.route('/event/:user/:id').put(eventCtrl.update);
    router.route('/event/:user/:id').delete(eventCtrl.delete);
    // Apply the routes to our application with the prefix /api
    app.use('/api', router);
    // Hook api
    var hookHandler = new hook_handler_1.default();
    hook.route('/:user/:webhook').post(hookHandler.receiveEvent);
    app.use('/hook', hook);
}
exports.default = setRoutes;
//# sourceMappingURL=routes.js.map