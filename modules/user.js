'use strict';
// const axios = require('axios');

const { argonEncryption, argonVerification } = require('../lib/utils');
const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');
const moment = require('moment');

moment.locale('zh-cn');

/**
 * 用户注册账号
 * @param {账号} account 可选
 * @param {密码} password 可选
 */
async function postUserRegister(account, password) {
    const returnData = {};
    const userInfo = {
        account,
        password: argonEncryption(password),
        baidu_account: '',
        asscss_token: '',
        refresh_token: '',
    };
    const authInfo = await wechatDB.collection('diskUser').findOne({account});
    if (authInfo) {
        throw new Error('账号已注册');
    }
    await wechatDB.collection('diskUser').insertOne(userInfo); 
    return returnData;
}

/**
 * 用户登录获取token
 * @param {账号} account 可选
 * @param {密码} password 可选
 */
async function postUserLogin(account, password) {
    const returnData = {};
    await wechatDB.collection('diskUser').findOne({
        account,
        password: argonVerification(password)
    });
    return returnData;
}

module.exports = {
    postUserRegister,
    postUserLogin,
};