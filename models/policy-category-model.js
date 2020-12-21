const mongoose = require('mongoose');
const schema = mongoose.Schema;

const policyCategorySchema = new schema({
    // policyCategoryId: {
    //     type: Number,
    //     required: true
    // },
    policyCategoryName: {
        type: String,
        required: true
    }
});
const policyCategory = mongoose.model('policy-category', policyCategorySchema);

module.exports = policyCategory;