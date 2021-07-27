'use strict';
// const axios = require('axios');

const { argonEncryption, argonVerification } = require('../lib/utils');
const { encodeJwt, decodeJwt } = require('../lib/utils');
const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');
const moment = require('moment');
const axios = require('axios')

const diskServ = require('./disk')
moment.locale('zh-cn');

/**
 * 用户注册账号
 * @param {账号} username 可选
 * @param {密码} password 可选
 */
async function postUserRegister(username, password) {
    const returnData = {};
    const userInfo = {
        username,
        password: await argonEncryption(password),
        avatar: '',
        baidu_username: '',
        access_token: '',
        refresh_token: '',
    };
    const authInfo = await wechatDB.collection('diskUser').findOne({username});
    if (authInfo) {
        throw new Error('账号已注册');
    }
    await wechatDB.collection('diskUser').insertOne(userInfo); 
    return returnData;
}

/**
 * 用户登录获取token
 * @param {账号} username 可选
 * @param {密码} password 可选
 */
async function postUserLogin(username, password) {
    const returnData = {};
    const user = await wechatDB.collection('diskUser').findOne({username});
    if(!user) {
        throw new Error('账号密码错误')
    }
    
    const isTrue = await argonVerification(password, user.password)
    if(isTrue) {
        const payload = {
            username
        }
        returnData.token = await encodeJwt(payload)
    }
    return returnData;
}

/**
 * 用户获取百度网盘二维码
 */
 async function getDiskQRcode() {
    const returnData = {};
    const data = await axios.get(`http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=Xo5gDASeVZRxHArna5hviweIGkllqetf&redirect_uri=oob&scope=basic,netdisk&display=tv&qrcode=1&force_login=1`)
    
    return data;
}

/**
 * 用户通过code换取access_token和refresh_token
 * @param {百度code} code 
 * @param {*} username 
 * @returns 
 */
 async function bindDisk(username, code) {
    const returnData = {};
    const data = await axios.get(`https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code=${code}&client_id=Xo5gDASeVZRxHArna5hviweIGkllqetf&client_secret=GVpNxBBQ3P79GTcGWPfnds5jk7Um6EM8&redirect_uri=oob`)
    await wechatDB.collection('diskUser').updateOne({username}, {$set:{ access_token: data.data.access_token, refresh_token: data.data.refresh_token}})
    return returnData;
}

/**
 * 获取用户基本信息
 * @param {*} username 
 */
async function getUserInfo(username) {
    try {
        await diskServ.getUserinfo(username)
    } catch(err) {
        
    }
    const user = await wechatDB.collection('diskUser').findOne({username})
    if(!user) {
        throw new Error('用户不存在')
    }
    return user
}
module.exports = {
    postUserRegister,
    postUserLogin,
    bindDisk,
    getUserInfo
};