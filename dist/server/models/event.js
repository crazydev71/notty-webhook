"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    webhook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Webhook'
    },
    headers: { type: mongoose.Schema.Types.Mixed },
    payloads: { type: mongoose.Schema.Types.Mixed },
    created: {
        type: Date,
        default: Date.now
    }
});
var Event = mongoose.model('Event', eventSchema);
exports.default = Event;
//# sourceMappingURL=event.js.map