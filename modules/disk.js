'use strict';
// const axios = require('axios');

const { argonEncryption, argonVerification } = require('../lib/utils');
const { encodeJwt, decodeJwt } = require('../lib/utils');
const mongodber = require('../utils/mongodber');
const diskDB = mongodber.use('disk');
const moment = require('moment');
const axios = require('axios');
const utils = require('../lib/utils');
const { ObjectId } = require('mongodb');
const { util } = require('config');

moment.locale('zh-cn');

/**
 * 根据username获取用户绑定百度网盘的用户信息
 * @param {账号} username
 */
async function getUserinfo(username) {
    const returnData = {};
    let update = [];
    const authInfo = await diskDB.collection('diskUser').findOne({username});
    if (!authInfo) {
        throw new Error('用户不存在');
    }
    const tasks = authInfo.disks.map( disk => {
        return utils.bdapis.getbdUserByToken(disk.access_token);
    })
    await Promise.all(tasks).then( result =>{
        update.push({
            baidu_name: result.baidu_name,
            netdisk_name: result.netdisk_name,
            avatar_url: result.avatar_url,
            vip_type: result.vip_type,
            uk: result.uk
        })
    })
    await diskDB.collection('diskUser').updateOne({username}, {$set: {disks}})

    return data.data
}

/**
 * 获取网盘容量信息
 * @param {账号} username 
 */
 async function getDiskinfo(username) {
    const returnData = { list: []};
    const disks = await diskDB.collection('DiskUser').find({username}).toArray();
    if (!disks.length) {
        return returnData;
    }
    const result = await utils.promiseTasks(disks, 'getQuotaByToken');
    returnData.list = result
    return returnData

}

/**
 * 获取网盘文件列表
 * @param {账号} username 
 */
 async function getDisklist(username, id,dir, order,web, folder,showempty) {
    let returnData = {};
    const disk = await diskDB.collection('DiskUser').findOne({_id: ObjectId(id), username});
    if (!disk) {
        throw new Error('网盘不存在');
    }
    const data = await utils.bdapis.getFileListByToken(disk.access_token,dir, order,web, folder,showempty)
    returnData = data.data
    return returnData

}

/**
 * 获取网盘递归文件列表
 * @param {账号} username 
 */
 async function getDisklistall(username, path) {
    const returnData = {};
   
    const authInfo = await diskDB.collection('diskUser').findOne({username});
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
   
    const authInfo = await diskDB.collection('diskUser').findOne({username});
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