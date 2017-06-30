"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var webhookScheme = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
        }]
});
var Webhook = mongoose.model('Webhook', webhookScheme);
exports.default = Webhook;
//# sourceMappingURL=webhook.js.map