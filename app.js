require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const kue = require("kue");
const queue = kue.createQueue({
    redis: process.env.REDIS_URL
});

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/webhooks/decision', (req, res) => {
    console.log(JSON.stringify(req.body));
    if (req.body.status === 'success') {
        let address = req.body.verification.person.idNumber;
        switch (req.body.verification.status) {
            case 'approved': {
                queue.create('approved', {
                    address: address,
                    countryCode: req.body.verification.document.country
                }).save();
                break;
            }
            case 'resubmission_requested': {
                queue.create('resubmission_requested', {
                    address: address
                }).save();
                break;
            }
            case 'declined': {
                queue.create('declined', {
                    address: address
                }).save();
                break;
            }
            case 'expired': {
                queue.create('expired', {
                    address: address
                }).save();
                break;
            }
            case 'abandoned': {
                queue.create('abandoned', {
                    address: address
                }).save();
                break;
            }
        }
    }
    res.send('');
});

app.listen(process.env.PORT || 80, () => {
    console.log('Veriff KYC listening!');
});