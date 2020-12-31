const config = require('config');
const axios = require('axios');
const host = config.get('host');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const {handler} = require('../utils/handler');

const crypto = require('crypto');
const hash = crypto.createHash('md5')
const mongodber = require('../utils/mongodber');
const wecahtDB = mongodber.use('wechat');

/**
 * 登录开放平台（第一步）
 * @param {账号} account 可选
 * @param {密码} password 可选
 */
async function postMemberLogin(account, password) {
    const returnData = {};
    account = account || config.get('account');
    password = password || config.get('password');
    const result = await axios.post(`${host}/member/login`, {account, password}).then(response => {return handler(response)});

    const userAccount = await wecahtDB.collection('user').findOne({account, Authorization: result.Authorization});
    if (!userAccount) {
        await wecahtDB.collection('user').insertOne(result);
    }
    return returnData
}

/**
 * 获取登录二维码
 */
async function postiPadLogin() {
    const returnData = {};
    const {Authorization, wcId} = await wecahtDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/iPadLogin`, {wcId: wcId,type: 2}, {headers: {Authorization}}).then(response => {return handler(response)});;
    const wId = result.wId;
    returnData.wId = wId;
    returnData.qrCodeUrl = result.qrCodeUrl
    await wecahtDB.collection('user').updateOne({account: config.get('account'), Authorization},{$set:{wId}});
    return returnData;
}
/**
 * 
 * @param {登录实例id} wId 
 * @param {好友微信id} wcId 
 * @param {首页md5} firstPageMd5 
 * @param {} maxId 
 */
async function saveFriendCircle(wId, wcId, firstPageMd5, maxId) {
    const result = await axios.post(host+'/getFriendCircle', {wId, wcId, firstPageMd5, maxId}, 
        {headers: {Authorization}}).then(handler);
    for(let sns of result.data.data.sns) {
        const snsMD5 = hash.update(JSON.stringify(sns.objectDesc)).digest('hex');
        parser.parseString(sns.objectDesc.xml, result => {
            result
        })
        // sns.objectDesc = jsonData;
        await wecahtDB.collection('friendCircleMSG').insert(sns)
    }
}

/**
 * 
 * @param {登录实例id} wId 
 * @param {认证信息} Authorization 
 */
async function getIsOnline() {

}


/**
 * 保存目标群组消息
 */
async function saveAimcircle() {

}

async function queryLoginWx() {
    let returnData = {};
    const {Authorization} = await wecahtDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/queryLoginWx`, {} ,{headers: {Authorization}}).then(response => {return handler(response)});
    returnData = result;
    return returnData
}

async function secondLogin() {
    let returnData = {};
    const {Authorization, } = await wecahtDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/queryLoginWx`, {} ,{headers: {Authorization}}).then(response => {return handler(response)});
    returnData = result;
    return returnData
}

/**
 * 获取登录信息 扫描二维码后需获取
 */
async function getIPadLoginInfo() {
    let returnData = {};
    const {Authorization, wId} = await wecahtDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getIPadLoginInfo`, {wId}, {headers: {Authorization}}).then(response => {return handler(response)});
    await wecahtDB.collection('userInfo').updateOne({wId},{$set:result},{upsert: true})
    returnData = result;
    return returnData
}

module.exports = {
    postMemberLogin,
    postiPadLogin,
    saveFriendCircle,
    getIsOnline,
    saveAimcircle,
    queryLoginWx,
    secondLogin,
    getIPadLoginInfo
}