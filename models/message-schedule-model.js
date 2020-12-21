const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageScheduleSchema = new schema({
    message: {
        type: String,
        required: true
    },
    notificationDate: {
        type: Date,
        required: true
    }
});
const messageSchedule = mongoose.model('message-schedule', messageScheduleSchema);

module.exports = messageSchedule;