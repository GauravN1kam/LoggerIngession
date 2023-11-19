const {Schema, model} = require('mongoose');

const logSchema = new Schema({
    level: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    meta: {
        type: Object,
        required: true
    }
}, {timestamps: true});

const Logs = model('Logger', logSchema);

module.exports = Logs;