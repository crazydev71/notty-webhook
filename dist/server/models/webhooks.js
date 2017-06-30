"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var webhookScheme = new mongoose.Schema({
    user: {
        type: Schema.Type.ObjectId,
        ref: 'User'
    },
    hookName: String,
    hookUrl: String,
    channel: [{
            channelName: String,
            isEnabled: boolean,
            config: Schema.Type.Mixed
        }],
    created: {
        typd: Date,
        default: Date.now
    },
    events: [{
            type: Schema.Type.ObjectId,
            ref: 'Event'
        }]
});
var Webhook = mongoose.model('Webhook', webhookScheme);
exports.default = Webhook;
//# sourceMappingURL=webhooks.js.map