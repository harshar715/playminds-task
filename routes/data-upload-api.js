const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const { Worker } = require('worker_threads');

const Agent = require('../models/agent-model');
const User = require('../models/user-model');
const UserAccount = require('../models/user-account-model');
const PolicyCarrier = require('../models/policy-carrier-model');
const PolicyCategory = require('../models/policy-category-model');
const Policy = require('../models/policy-model');


// router.post('/loadCSVData', function (req, res, next) {

//     fs.createReadStream('./data.csv')
//         .pipe(csv())
//         .on('data', async (row) => {

//             const agent = {
//                 _id: new mongoose.Types.ObjectId(),
//                 angentName: row.agent
//             };
//             const user = {
//                 _id: new mongoose.Types.ObjectId(),
//                 firstName: row.firstname,
//                 dateOfBirth: row.dob,
//                 address: row.address,
//                 phoneNumber: row.phone,
//                 city: row.city,
//                 state: row.state,
//                 zipCode: row.zip,
//                 email: row.email,
//                 gender: row.gender,
//                 userType: row.userType
//             };
//             const useraccount = {
//                 _id: new mongoose.Types.ObjectId(),
//                 accountName: row.account_name,
//                 accountType: row.account_type,
//                 userId: user._id
//             };
//             const policycarrier = {
//                 _id: new mongoose.Types.ObjectId(),
//                 policyCarrierName: row.company_name,
//                 policyCarrierCSR: row.csr,
//                 policyCarrierProducer: row.producer
//             };
//             const policycategory = {
//                 _id: new mongoose.Types.ObjectId(),
//                 policyCategoryName: row.category_name
//             };

//             Promise.all([
//                 Agent.findOne({ angentName: row.agent }),
//                 User.findOne({ firstName: row.firstname }),
//                 PolicyCarrier.findOne({ policyCarrierName: row.company_name }),
//                 PolicyCategory.findOne({ policyCategoryName: row.category_name })
//             ]).then(async (results) => {
//                 console.log(results);
//                 let agentdata; let userdata; let policycarrierdata; let policycategorydata;

//                 if (results[0] === null) {
//                     agentdata = agent;
//                     await Agent.create(agent);
//                 } else {
//                     agentdata = results[0];
//                 }
//                 if (results[1] === null) {
//                     userdata = user;
//                     await User.create(user);
//                     await UserAccount.create(useraccount);
//                 } else {
//                     userdata = results[1];
//                 }
//                 if (results[2] === null) {
//                     policycarrierdata = policycarrier;
//                     await PolicyCarrier.create(policycarrier);
//                 } else {
//                     policycarrierdata = results[2];
//                 }
//                 if (results[3] === null) {
//                     policycategorydata = policycategory;
//                     await PolicyCategory.create(policycategory);
//                 } else {
//                     policycategorydata = results[3];
//                 }

//                 const policydata = {
//                     policyNumber: row.policy_number,
//                     policyType: row.policy_type,
//                     policyMode: row.policy_mode,
//                     policyPremiumAmount: row.premium_amount,
//                     policyStartDate: row.policy_start_date,
//                     policyEndDate: row.policy_end_date,
//                     policyCategory: policycategorydata._id,
//                     policyCarrierId: policycarrierdata._id,
//                     userId: userdata._id,
//                     agentId: agentdata._id
//                 };
//                 await Policy.create(policydata);
//             });

//         })
//         .on('end', () => {
//             res.send('CSV file successfully processed');
//             console.log('CSV file successfully processed');
//         });

// });

router.post('/loadCSVData', function (req, res, next) {

    fs.createReadStream('./data.csv')
        .pipe(csv())
        .on('data', async (row) => {

            let agent = new Agent({
                _id: new mongoose.Types.ObjectId(),
                angentName: row.agent
            });
            let user = new User({
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
            });
            let useraccount = new UserAccount({
                _id: new mongoose.Types.ObjectId(),
                accountName: row.account_name,
                accountType: row.account_type,
                userId: user._id
            });
            let policycarrier = new PolicyCarrier({
                _id: new mongoose.Types.ObjectId(),
                policyCarrierName: row.company_name,
                policyCarrierCSR: row.csr,
                policyCarrierProducer: row.producer
            });
            let policycategory = new PolicyCategory({
                _id: new mongoose.Types.ObjectId(),
                policyCategoryName: row.category_name
            });
            let policy = new Policy({
                policyNumber: row.policy_number,
                policyType: row.policy_type,
                policyMode: row.policy_mode,
                policyPremiumAmount: row.premium_amount,
                policyStartDate: row.policy_start_date,
                policyEndDate: row.policy_end_date,
                policyCategory: policycategory._id,
                policyCarrierId: policycarrier._id,
                userId: user._id
            });
            await agent.save(async function (err) {
                if (err) {
                    agent = await Agent.findOne({ angentName: row.agent });
                }
            });
            await user.save(async function (err) {
                if (err) {
                    user = await User.findOne({ firstName: row.firstname });
                }
            });
            await useraccount.save(async function (err) {
                if (err) {
                    useraccount = await UserAccount.findOne({ accountName: row.account_name });
                }
            });
            await policycarrier.save(async function (err) {
                if (err) {
                    policycarrier = await PolicyCarrier.findOne({ policyCarrierName: row.company_name });
                }
            });
            await policycategory.save(async function (err) {
                if (err) {
                    policycategory = await PolicyCategory.findOne({ policyCategoryName: row.category_name });
                }
            });
            await policy.save();


        })
        .on('end', () => {
            res.send('CSV file successfully processed');
            console.log('CSV file successfully processed');
        });

});

router.post('/loadCSVDataWithThreads', function (req, res, next) {

    const worker = new Worker(`
    const mongoose = require('mongoose');

    const csv = require('csv-parser');
    const fs = require('fs');
    const Agent = require('./models/agent-model');
    const User = require('./models/user-model');
    const UserAccount = require('./models/user-account-model');
    const PolicyCarrier = require('./models/policy-carrier-model');
    const PolicyCategory = require('./models/policy-category-model');
    const Policy = require('./models/policy-model');

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
            Agent.create(agent).then().catch();
            User.create(user).then().catch();
            UserAccount.create(useraccount).then().catch();
            PolicyCarrier.create(policycarrier).then().catch();
            PolicyCategory.create(policycategory).then().catch();
            Policy.create(policy).then().catch();


        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
    `, { eval: true });
    worker.on('exit', (code) => {
        res.send('CSV file successfully processed');
    });

});

module.exports = router;

