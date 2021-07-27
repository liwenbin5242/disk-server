'use strict';
// const axios = require('axios');

const { argonEncryption, argonVerification } = require('../lib/utils');
const { encodeJwt, decodeJwt } = require('../lib/utils');
const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');
const moment = require('moment');
const axios = require('axios')

moment.locale('zh-cn');

/**
 * 获取百度用户信息
 * @param {账号} username
 */
async function getUserinfo(username) {
    const returnData = {};
   
    const authInfo = await wechatDB.collection('diskUser').findOne({username});
    if (!authInfo) {
        throw new Error('用户不存在');
    }
    const data = await axios.get(`https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo&access_token=${authInfo.access_token}`)
    await wechatDB.collection('diskUser').updateOne({username}, {$set: {avatar: data.data.avatar_url, baidu_username: data.data.baidu_name}})

    return data.data
}

/**
 * 获取网盘容量信息
 * @param {账号} username 
 */
 async function getDiskinfo(username) {
    const returnData = {};
   
    const authInfo = await wechatDB.collection('diskUser').findOne({username});
    if (!authInfo) {
        throw new Error('用户不存在');
    }
    const data = await axios.get(`https://pan.baidu.com/api/quota?access_token=${authInfo.access_token}`)
    return data.data

}

/**
 * 获取网盘文件列表
 * @param {账号} username 
 */
 async function getDisklist(username) {
    const returnData = {};
   
    const authInfo = await wechatDB.collection('diskUser').findOne({username});
    if (!authInfo) {
        throw new Error('用户不存在');
    }
    const data = await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=list&access_token=${authInfo.access_token}&web=web`)
      return data.data

}

/**
 * 获取网盘递归文件列表
 * @param {账号} username 
 */
 async function getDisklistall(username, path) {
    const returnData = {};
   
    const authInfo = await wechatDB.collection('diskUser').findOne({username});
    if (!authInfo) {
        throw new Error('用户不存在');
    }
    const data = await axios.get(`https://pan.baidu.com/rest/2.0/xpan/multimedia?method=listall&access_token=${authInfo.access_token}&path=${path}`)
      return data.data

}

/**
 * 搜索文件
 * @param {账号} username 
 */
 async function getDiskSearch(username, key, dir) {
    const returnData = {};
   
    const authInfo = await wechatDB.collection('diskUser').findOne({username});
    if (!authInfo) {
        throw new Error('用户不存在');
    }
    const data = await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=search&access_token=${authInfo.access_token}&recursion=1&dir=${dir||'/'}&web=1&key=${key}`)
      return data.data

}
module.exports = {
    getUserinfo,
    getDiskinfo,
    getDisklist,
    getDisklistall,
    getDiskSearch
};