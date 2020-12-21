const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');

const Agent = require('../models/agent-model');
const User = require('../models/user-model');
const UserAccount = require('../models/user-account-model');
const PolicyCarrier = require('../models/policy-carrier-model');
const PolicyCategory = require('../models/policy-category-model');
const Policy = require('../models/policy-model');

fs.createReadStream('./data.csv')
    .pipe(csv())
    .on('data', async (row) => {

        const agent = {
            _id: new mongoose.Types.ObjectId(),
            angentName: row.agent
        };
        const user = {
            _id: new mongoose.Types.ObjectId(),
            firstName: row.firstname,
            dateOfBirth: row.dob,
            address: row.address,
            phoneNumber: row.phone,
            city: row.city,
            state: row.state,
            zipCode: row.zip,
            email: row.email,
            gender: row.gender,
            userType: row.userType
        };
        const useraccount = {
            _id: new mongoose.Types.ObjectId(),
            accountName: row.account_name,
            accountType: row.account_type,
            userId: user._id
        };
        const policycarrier = {
            _id: new mongoose.Types.ObjectId(),
            policyCarrierName: row.company_name,
            policyCarrierCSR: row.csr,
            policyCarrierProducer: row.producer
        };
        const policycategory = {
            _id: new mongoose.Types.ObjectId(),
            policyCategoryName: row.category_name
        };
        const policy = {
            policyNumber: row.policy_number,
            policyType: row.policy_type,
            policyMode: row.policy_mode,
            policyPremiumAmount: row.premium_amount,
            policyStartDate: row.policy_start_date,
            policyEndDate: row.policy_end_date,
            policyCategory: policycategory._id,
            policyCarrierId: policycarrier._id,
            userId: user._id,
            agentId: agent._id
        };
        Promise.all([Agent.create(agent),
        User.create(user),
        UserAccount.create(useraccount),
        PolicyCarrier.create(policycarrier),
        PolicyCategory.create(policycategory),
        Policy.create(policy)]).then(results => {
            console.log('done');
        })


    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });