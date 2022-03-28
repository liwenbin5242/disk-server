'use strict';
// const axios = require('axios');

const { argonEncryption, argonVerification } = require('../lib/utils');
const { encodeJwt } = require('../lib/utils');
const mongodber = require('../utils/mongodber');
const diskDB = mongodber.use('disk');
const utils = require('../lib/utils');
const moment = require('moment');
const { ObjectID } = require('mongodb');
const redis = require('../utils/rediser');
const _ = require('lodash');
const errCode = require('../utils/errCodes');

moment.locale('zh-cn');

/**
 * 用户注册账号
 * @param {账号} username 可选
 * @param {密码} password 可选
 */
async function postUserRegister(username, password) {
    const returnData = {};
    const authInfo = await diskDB.collection('User').findOne({username});
    const userInfo = {
        username,
        password: await argonEncryption(password),
        phone: '',
        name: '',
        avatar: '',
        utime: new Date,
        ctime: new Date
    };
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
    if (!user) {
        throw new Error('账号或密码错误');
    }
    const isTrue = await argonVerification(password, user.password);
    if (isTrue) {
        const payload = {
            user
        };
        returnData.token = await encodeJwt(payload);
        returnData.username = username;
        returnData.userId = user._id;
        return returnData;
    }
    throw new Error('账号或密码错误');
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
    const bduserinfo = await utils.bdapis.getbdUserByToken(data.access_token);
    redis.set(bduserinfo.data.uk, data.access_token, data.expires_in);
    await diskDB.collection('DiskUser').findOneAndUpdate({uk: bduserinfo.data.uk, }, {$set: { 
        username,
        avatar_url: bduserinfo.data.avatar_url,
        baidu_name: bduserinfo.data.baidu_name,
        netdisk_name: bduserinfo.data.netdisk_name,
        uk: bduserinfo.data.uk,
        expires_in: data.expires_in, 
        access_token: data.access_token, 
        refresh_token: data.refresh_token,
        scope: data.scope,
        uptime: new Date
    }}, {upsert: true});
    return returnData;
}

/**
 * 获取用户基本信息
 * @param {*} username 
 */
async function getUserInfo(username) {
    const user = await diskDB.collection('User').findOne({username});
    if (!user) {
        throw new Error('用户不存在');
    }
    delete user.password;
    return user;
}

/**
 * 获取用户关联的百度网盘账号
 * @param {*} username 
 */
async function getUserDisks(username) {
    const user = await diskDB.collection('User').findOne({username});
    if (!user) {
        throw new Error('用户不存在');
    }
    const disks = await diskDB.collection('DiskUser').find({username: user.username}).toArray();
    let disksInfo = await utils.promiseTasks(disks, 'getbdUserByToken');
    const diskQuota = await utils.promiseTasks(disks, 'getQuotaByToken');
    disksInfo = _.zipWith(disksInfo, diskQuota, disks, (a, b, c) =>{
        return {
            info: a,
            quota: b,
            id: {id: c._id.toString()}
        };
    });
    return {
        total: disks.length, 
        list: disksInfo.map(d => {
            return Object.assign(d.info.data, d.quota.data, d.id);
        })};
}

/**
 * 解绑用户关联的百度网盘账号
 * @param {*} username 
 */
async function deleteDisk(username, id) {
    const user = await diskDB.collection('User').findOne({username});
    if (!user) {
        throw new Error('用户不存在');
    }
    await diskDB.collection('DiskUser').remove({_id: ObjectID(id), username});
    return {};
}
module.exports = {
    postUserRegister,
    postUserLogin,
    bindDisk,
    getUserInfo,
    getUserDisks,
    deleteDisk,
};