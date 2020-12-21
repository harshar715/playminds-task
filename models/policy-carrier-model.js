const mongoose = require('mongoose');
const schema = mongoose.Schema;

const policyCarrierSchema = new schema({
    // policyCarrierId: {
    //     type: Number,
    //     required: true
    // },
    policyCarrierName: {
        type: String,
        required: true
    },
    policyCarrierCSR: {
        type: String
    },
    policyCarrierProducer: {
        type: String
    }
});
const policyCarrier = mongoose.model('policy-carrier', policyCarrierSchema);

module.exports = policyCarrier;