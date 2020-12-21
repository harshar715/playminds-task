const mongoose = require('mongoose');
const schema = mongoose.Schema;

const agentSchema = new schema({
    // agentId: {
    //     type: Number,
    //     required: true
    // },
    angentName: {
        type: String,
        required: true,
        unique: true
    }
});
const agent = mongoose.model('agent', agentSchema);

module.exports = agent;