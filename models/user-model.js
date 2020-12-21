const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    // userId: {
    //     type: Number,
    //     required: true
    // },
    firstName: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: String
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
    email: {
        type: String
    },
    gender: {
        type: String
    },
    userType: {
        type: String
    }

});
const user = mongoose.model('user', userSchema);

module.exports = user;