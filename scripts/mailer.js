'use strict';
const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');
const moment = require('moment');

// async..await is not allowed in global scope, must use a wrapper

/**
 * 
 * @param {发件人} from 
 * @param {收件人} to 
 * @param {主题} subject 
 * @param {内容} text 
 * @param {内容} html 
 */
async function main(from, to, subject, text, html) {
   
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.163.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'liwenbin5242@163.com', // generated ethereal user
            pass: 'SMBRTTERKPIVBAPO', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from, // sender address
        to,  //  '294723284@qq.com', list of receivers
        subject, // '掉线通知', Subject line
        text, // `机器人已掉线,时间${moment().format()}`,  plain text body
        html, // '<b>机器人已掉线</b>',html body
    });

    logger.warn('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    logger.warn('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
module.exports = main;