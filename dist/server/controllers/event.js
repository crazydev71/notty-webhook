"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("../models/event");
var EventCtrl = (function () {
    function EventCtrl() {
        var _this = this;
        this.model = event_1.default;
        // Get All Events
        this.getAll = function (req, res) {
            _this.model.find({ user: req.params.user }).populate('webhook').exec(function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        // Get a Event
        this.get = function (req, res) {
            _this.model.findOne({ user: req.params.user, webhook: req.params.webhook, _id: req.params.id }).exec(function (err, obj) {
                if (err) {
                    return console.error(err);
                }
                res.json(obj);
            });
        };
        // Get Events in a Webhook
        this.getEventsInWebhook = function (req, res) {
            _this.model.find({ user: req.params.user, webhook: req.params.webhook }, function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        // Delete Event
        this.delete = function (req, res) {
            _this.model.findOneAndRemove({ _id: req.params.id }, function (err) {
                if (err) {
                    return console.error(err);
                }
                res.sendStatus(200);
            });
        };
    }
    return EventCtrl;
}());
exports.default = EventCtrl;
//# sourceMappingURL=event.js.map