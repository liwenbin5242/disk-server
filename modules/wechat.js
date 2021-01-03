const config = require('config');
const axios = require('axios');
const host = config.get('host');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const {handler} = require('../utils/handler');

const crypto = require('crypto');
const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');

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

    const userAccount = await wechatDB.collection('user').findOne({account, Authorization: result.Authorization});
    if (!userAccount) {
        await wechatDB.collection('user').insertOne(result);
    }
    return returnData
}

/**
 * 获取登录二维码
 */
async function postiPadLogin() {
    const returnData = {};
    const {Authorization, wcId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/iPadLogin`, {wcId: wcId,type: 2}, {headers: {Authorization}}).then(response => {return handler(response)});;
    const wId = result.wId;
    returnData.wId = wId;
    returnData.qrCodeUrl = result.qrCodeUrl
    await wechatDB.collection('user').updateOne({account: config.get('account'), Authorization},{$set:{wId}});
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
        await wechatDB.collection('friendCircleMSG').insert(sns)
    }
}

/**
 * 
 * @param {登录实例id} wId 
 * @param {认证信息} Authorization 
 */
async function getIsOnline(wId, Authorization,) {
    const result = await axios.post(`${host}/getIsOnline`, {wId} ,{headers: {Authorization}}).then(response => {return handler(response)});
    returnData = result;
    return returnData
}


/**
 * 保存目标群组消息
 */
async function saveAimcircle() {

}

async function queryLoginWx() {
    let returnData = {};
    const {Authorization} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/queryLoginWx`, {} ,{headers: {Authorization}}).then(response => {return handler(response)});
    returnData = result;
    return returnData
}

async function secondLogin() {
    let returnData = {};
    const {Authorization, } = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/queryLoginWx`, {} ,{headers: {Authorization}}).then(response => {return handler(response)});
    returnData = result;
    return returnData
}

/**
 * 获取登录信息 扫描二维码后需获取
 */
async function getIPadLoginInfo() {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getIPadLoginInfo`, {wId}, {headers: {Authorization}}).then(response => {return handler(response)});
    await wechatDB.collection('userInfo').updateOne({wId},{$set:result},{upsert: true})
    returnData = result;
    return returnData
}

/**
 * 通讯录初始化
 */
async function initAddressList() {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/initAddressList`, {wId}, {headers: {Authorization}}).then(response => {return handler(response)});
    returnData = result;
    return returnData || {};
}

/**
 * 获取通讯录
 */
async function getAddressList() {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getAddressList`, {wId}, {headers: {Authorization}}).then(response => {return handler(response)});
    returnData = result;
    await wechatDB.collection('friends').updateOne({wId}, {$set:result}, {upsert: true});
    return returnData || {};
}

/**
 * 获取标签列表
 */
async function getContactLabelList() {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getContactLabelList`, {wId}, {headers: {Authorization}}).then(response => {return handler(response)});
    returnData.labelList = result;
    returnData.wId = wId;
    await wechatDB.collection('friends').updateOne({wId}, {$set:returnData}, {upsert: true});
    return returnData || {};
}

/**
 * 获取标签下好友列表
 */
async function getLabelContacts(labelId) {
    let returnData = {
        list: []
    };
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getLabelContacts`, {wId, labelId}, {headers: {Authorization}}).then(response => {return handler(response)});
    returnData.list = result;
    return returnData || {};
}

/**
 * 保存肉鸡的朋友圈
 */
async function getRoujiFriendCircle() {
    let returnData = {};
    const {list} = await getLabelContacts('1');
    for(let i of list) {
        const results = await getFriendCircle(i.userName);
        for (let sns of results.sns) {
            const md5 = crypto.createHash('md5').update(JSON.stringify(sns.id)).digest('hex');
            sns.md5 = md5;
            sns.firstPageMd5 = results.firstPageMd5;
            const frientCircleContent = await wechatDB.collection('frientCircleSNS').findOne({md5});
            if (!frientCircleContent) {
                await wechatDB.collection('frientCircleSNS').insertOne(sns);
            }
        }
    }
    return returnData || {};
}

/**
 * 获取好友的朋友圈
 * @param {好友微信id} wcId 
 */
async function getFriendCircle(wcId, firstPageMd5, maxId) {
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getFriendCircle`, {wId, wcId, firstPageMd5, maxId}, {headers: {Authorization}}).then(response => {return handler(response)});
    return result;
}

/**
 * 发送消息到冲冲冲
 * @param {群id} chatRoomId 
 */
async function postRoujiFriendCircleToRoom(chatRoomId) {
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const time = (new Date()).getTime() - 5 * 60 * 1000;
    const contents = await wechatDB.collection('frientCircleSNS').find({createTime: {$gte: time/1000}}).toArray();
    for( let content of contents) {
        const jsonData = await new Promise((resolve, reject)=> {
            parser.parseString(content.objectDesc.xml,function(err,result){
                return resolve(result.TimelineObject) ;             
            });
        })
        content = jsonData.contentDesc[0];
        const result = await new Promise((resolve, reject) => {
            setTimeout(async()=> {
                const result = await axios.post(`${host}/sendText`, {wId, wcId:chatRoomId, content}, {headers: {Authorization}}).then(response => {return handler(response)});
                resolve(result)
            },  Math.random()* 50000)
        })
        result
    }
    return {};
}
async function postCreateChatroom(){
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const userList = 'liwenbin5242,wxid_g2kxlsivy8x412';
    const result = await axios.post(`${host}/createChatroom`, {wId, userList, topic: '冲冲冲'}, {headers: {Authorization}}).then(response => {return handler(response)});
    returnData = result;
    return returnData || {};
}
module.exports = {
    postMemberLogin,
    postiPadLogin,
    saveFriendCircle,
    getIsOnline,
    saveAimcircle,
    queryLoginWx,
    secondLogin,
    getIPadLoginInfo,
    initAddressList,
    getAddressList,
    getContactLabelList,
    getLabelContacts,
    getRoujiFriendCircle,
    getFriendCircle,
    postRoujiFriendCircleToRoom,
    postCreateChatroom
}