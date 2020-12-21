const express = require('express');
const router = express.Router();

const User = require('../models/user-model');
const PolicyCarrier = require('../models/policy-carrier-model');
const PolicyCategory = require('../models/policy-category-model');
const Policy = require('../models/policy-model');

router.get('/getPolicyByUsername', (req, res, next) => {
    if (req.query.username) {
        User.find({ firstName: { $regex: new RegExp(req.query.username, 'i') } }).select({ firstName: 1, _id: 1 }).lean()
            .then((users) => {
                if (users.length !== 0) {
                    let count = 0;
                    let searchResult = new Array();
                    users.forEach(user => {
                        Policy.findOne({ userId: user._id }).select({ policyNumber: 1, policyType: 1, policyMode: 1, policyPremiumAmount: 1, policyStartDate: 1, policyEndDate: 1, _id: 0 }).lean()
                            .then(policy => {
                                searchResult.push({ userDetails: user.firstName, policyDetails: policy });
                                count++;
                                if (count === users.length) {
                                    res.status(200).json({
                                        message: 'Data Fetched Successful',
                                        data: searchResult,
                                        status: 200
                                    });
                                }
                            }).catch(next);
                    });

                } else {
                    res.status(200).json({
                        message: 'No Data Found!',
                        data: [],
                        status: 200
                    });
                }
            }).catch(next)
    } else {
        res.status(200).json({
            message: 'Enter Valid UserName',
            data: [],
            status: 200
        });
    }
});

router.get('/getAggregatedPolicyByUsername', (req, res, next) => {

    User.find({ firstName: { $regex: new RegExp(req.query.username, 'i') } }).select({ firstName: 1, dateOfBirth: 1, address: 1, phoneNumber: 1, city: 1, state: 1, zipCode: 1, email: 1, gender: 1, userType: 1, _id: 1 }).lean()
        .then((users) => {
            if (users.length !== 0) {
                let count = 0;
                let searchResult = new Array();
                users.forEach(user => {
                    Policy.findOne({ userId: user._id }).select({ policyNumber: 1, policyType: 1, policyMode: 1, policyPremiumAmount: 1, policyStartDate: 1, policyEndDate: 1, policyCategory: 1, policyCarrierId: 1, _id: 0 }).lean()
                        .then(policy => {
                            Promise.all([
                                PolicyCarrier.findOne({ _id: policy.policyCarrierId }).select({ policyCarrierName: 1, policyCarrierCSR: 1, policyCarrierProducer: 1, _id: 0 }).lean(),
                                PolicyCategory.findOne({ _id: policy.policyCategory }).select({ policyCategoryName: 1, _id: 0 }).lean()
                            ]).then(results => {
                                searchResult.push({ userDetails: user, policyDetails: policy, policyCarrierDetails: results[0], policyCatgoryDetails: results[1] });
                                count++;
                                if (count === users.length) {
                                    res.status(200).json({
                                        message: 'Data Fetched Successful',
                                        data: searchResult,
                                        status: 200
                                    });
                                }
                            });

                        }).catch(next);
                });

            } else {
                res.status(200).json({
                    message: 'No Data Found!',
                    data: [],
                    status: 200
                });
            }
        }).catch(next)
});


module.exports = router;
