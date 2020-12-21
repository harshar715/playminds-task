const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pidusage = require('pidusage')
const app = express();

const dataRoutes = require('./routes/data-upload-api');
const policyRoutes = require('./routes/policy-api');
const messageRoutes = require('./routes/message-schedule-api');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, function () { console.log('listening to PORT'); });

mongoose.connect(`mongodb+srv://harshar715:harsha12345@mydatabase-imncy.mongodb.net/playmind-task?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.Promise = global.Promise;

app.use('/api', dataRoutes);
app.use('/api', policyRoutes);
app.use('/api', messageRoutes);

const CHECK_CPU_USAGE_INTERVAL = 1000 * 60; // every minute
const HIGH_CPU_USAGE_LIMIT = 70; // percentage

autoRestart = setInterval(function () {
    pidusage(process.pid, function (err, stats) {
        if (!err) {
            console.log(stats.cpu);
            if (stats.cpu > HIGH_CPU_USAGE_LIMIT) {
                console.log('restart due to high cpu usage');
                process.exit(1);
            }
        }
    })
}, CHECK_CPU_USAGE_INTERVAL);