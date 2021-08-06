'use strict';
// const axios = require('axios');

const { argonEncryption, argonVerification } = require('../lib/utils');
const { encodeJwt} = require('../lib/utils');
const mongodber = require('../utils/mongodber');
const diskDB = mongodber.use('disk');
const axios = require('axios');

const diskServ = require('./disk');
const utils = require('../lib/utils')
const moment = require('moment');
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
        name: '',
        avatar: '',
    };
    const authInfo = await diskDB.collection('User').findOne({username});
    if (authInfo) {
        throw new Error('账号已注册');
    }
    await diskDB.collection('User').insertOne(userInfo); 
    return returnData;
}

/**
 * 用户登录获取token
 * @param {账号} username 可选
 * @param {密码} password 可选
 */
async function postUserLogin(username, password) {
    const returnData = {};
    const user = await diskDB.collection('User').findOne({username});
    
    if(!user) {
        throw new Error('账号或密码错误')
    }
    const isTrue = await argonVerification(password, user.password)
    if(isTrue) {
        const payload = {
            user
        }
        return returnData.token = await encodeJwt(payload)
    }
    throw new Error('账号或密码错误')
}


/**
 * 用户通过code换取access_token和refresh_token
 * @param {百度code} code 
 * @param {*} username 
 * @returns 
 */
 async function bindDisk(username, code) {
    const returnData = {};
    const {data} = await utils.bdapis.code2token(code);
    await diskDB.collection('DiskUser').insertOne({ 
        username,
        expires_in: data.expires_in, 
        access_token: data.access_token, 
        refresh_token: data.refresh_token
    })
    return returnData;
}

/**
 * 获取用户基本信息
 * @param {*} username 
 */
async function getUserInfo(username) {
    const user = await diskDB.collection('User').findOne({username})
    if(!user) {
        throw new Error('用户不存在')
    }
    return user
}

/**
 * 获取用户关联的百度网盘账号
 * @param {*} username 
 */
 async function getUserDisks(username) {
    const user = await diskDB.collection('User').findOne({username});
    if(!user) {
        throw new Error('用户不存在')
    }
    const disks = await diskDB.collection('DiskUser').find({username: user.username}).toArray();
    return {list: disks};
}
module.exports = {
    postUserRegister,
    postUserLogin,
    bindDisk,
    getUserInfo,
    getUserDisks,
};