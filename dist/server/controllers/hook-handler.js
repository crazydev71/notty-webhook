"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webhook_1 = require("../models/webhook");
var event_1 = require("../models/event");
var HookHandler = (function () {
    function HookHandler() {
        this.receiveEvent = function (req, res) {
            var user = req.params.user, webhook = req.params.webhook;
            var eventData = req.body, eventHeader = req.headers;
            console.log(req.headers);
            var newEvent = new event_1.default({ user: user, webhook: webhook, headers: eventHeader, payloads: eventData });
            newEvent.save(function (err, item) {
                webhook_1.default.findOne({ _id: item.webhook }, function (err, w) {
                    if (!err) {
                        w.events.push(item._id);
                        w.save();
                    }
                });
            });
            return res.sendStatus(200);
        };
    }
    return HookHandler;
}());
exports.default = HookHandler;
//# sourceMappingURL=hook-handler.js.map