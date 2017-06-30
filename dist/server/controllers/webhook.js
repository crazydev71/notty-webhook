"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webhook_1 = require("../models/webhook");
var WebhookCtrl = (function () {
    function WebhookCtrl() {
        var _this = this;
        this.model = webhook_1.default;
        // Get All Webhooks
        this.getAll = function (req, res) {
            _this.model.find({ user: req.params.user }, function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        // Get a Webhook
        this.get = function (req, res) {
            _this.model.findOne({ user: req.params.user, _id: req.params.id }).populate('events').exec(function (err, obj) {
                if (err) {
                    return console.error(err);
                }
                res.json(obj);
            });
        };
        // Insert Webhook
        this.insert = function (req, res) {
            var obj = new _this.model(req.body);
            obj.user = req.params.user;
            obj.save(function (err, item) {
                if (err && err.code === 11000) {
                    res.sendStatus(400);
                }
                if (err) {
                    return console.error(err);
                }
                item.url = req.protocol + '://' + req.get('host') + "/hook/" + item.user + '/' + item._id;
                item.save(function (err, saved) {
                    res.status(200).json(saved);
                });
            });
        };
        // Edit webhook
        this.update = function (req, res) {
            _this.model.findOneAndUpdate({ user: req.params.user, _id: req.params.id }, req.body, function (err, item) {
                if (err) {
                    return console.error(err);
                }
                res.json(item);
            });
        };
        this.delete = function (req, res) {
            _this.model.findOneAndRemove({ _id: req.params.id }, function (err) {
                if (err) {
                    return console.error(err);
                }
                res.sendStatus(200);
            });
        };
    }
    return WebhookCtrl;
}());
exports.default = WebhookCtrl;
//# sourceMappingURL=webhook.js.map