const mongoose = require('mongoose');
const schema = mongoose.Schema;

const counterSchema = new schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
});
const counter = mongoose.model('counter', counterSchema);

module.exports = counter;