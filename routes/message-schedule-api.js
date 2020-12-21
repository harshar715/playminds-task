const express = require('express');
const router = express.Router();
const schedule = require('node-schedule');
const MessageSchedule = require('../models/message-schedule-model');

router.post('/postMessageSchedule', function (req, res, next) {

    if (req.query.message && req.query.date && req.query.time) {
        let myMessageSchedule = {
            message: req.query.message,
            notificationDate: new Date(Number(req.query.date.split('-')[2]), Number(req.query.date.split('-')[1]) - 1, Number(req.query.date.split('-')[0]), Number(req.query.time.split(':')[0]), Number(req.query.time.split(':')[1])),
        }
        MessageSchedule.create(myMessageSchedule).then(function (messageReg) {
            if (messageReg) {
                res.status(200).json({
                    message: 'Messsage Added Successful',
                    data: messageReg,
                    status: 200
                });
                let oneDay = new Date(myMessageSchedule.notificationDate);
                schedule.scheduleJob(oneDay, function () {
                    console.log('Notiification from server')
                });

            } else {
                res.status(200).json({
                    message: 'Messsage Not Added',
                    data: [],
                    status: 200
                });
            }
        }).catch(next)
    } else {
        res.status(200).json({
            message: 'Enter Valid Message, Date & Time',
            data: '',
            status: 200
        });
    }
});

module.exports = router;