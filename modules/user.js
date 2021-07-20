'use strict';
const config = require('config');

const axios = require('axios');
const crypto = require('crypto');

const {logger} = require('../utils/logger');
const {handler} = require('../utils/handler');

const mongodber = require('../utils/mongodber');
const redis = require('../utils/rediser');
const wechatDB = mongodber.use('wechat');
const mailer = require('../scripts/mailer');
const moment = require('moment');

moment.locale('zh-cn');
/**
 * 用户登录获取token
 * @param {账号} account 可选
 * @param {密码} password 可选
 */
async function postUserLogin(account, password) {
    const returnData = {};

    return returnData;
}

module.exports = {
    postUserLogin,
};