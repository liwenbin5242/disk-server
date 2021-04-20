const config = require('config');
const host = config.get('host');

const {handler} = require('../utils/handler');
const redis = require('../utils/rediser');

const nodemailer = require('nodemailer'); 
const wechat = require('./../modules/wechat');
const axios = require('axios');

async function sendOffLineMail() {
    const result = await wechat.getIsOnline();
    if (!result) {
        sendMail();
    }
}

sendOffLineMail();