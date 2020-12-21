const mongoose = require('mongoose');
const schema = mongoose.Schema;

const policySchema = new schema({
    // policyId: {
    //     type: Number,
    //     required: true
    // },
    policyNumber: {
        type: String,
        required: true
    },
    policyType: {
        type: String
    },
    policyMode: {
        type: String
    },
    policyPremiumAmount: {
        type: String
    },
    policyStartDate: {
        type: String
    },
    policyEndDate: {
        type: String
    },
    policyCategory: {
        type: String
    },
    policyCarrierId: {
        type: String
    },
    userId: {
        type: String
    }

});
const policy = mongoose.model('policy', policySchema);

module.exports = policy;