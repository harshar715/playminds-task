const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userAccountSchema = new schema({
    // accountId: {
    //     type: Number,
    //     required: true
    // },
    accountName: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    userId: {
        type: String
    }

});
const userAccount = mongoose.model('user-account', userAccountSchema);

module.exports = userAccount;