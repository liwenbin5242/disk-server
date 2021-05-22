const config = require('config');

const axios = require('axios');
const crypto = require('crypto');

const host = config.get('host');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const {logger} = require('../utils/logger');
const {handler} = require('../utils/handler');

const mongodber = require('../utils/mongodber');
const redis = require('../utils/rediser');
const wechatDB = mongodber.use('wechat');
const mailer = require('../scripts/mailer');
const moment = require('moment');
moment.locale('zh-cn');
/**
 * 登录开放平台（第一步）
 * @param {账号} account 可选
 * @param {密码} password 可选
 */
async function postMemberLogin(account, password) {
    const returnData = {};
    account = account || config.get('account');
    password = password || config.get('password');
    const result = await axios.post(`${host}/member/login`, {account, password}).then(response => {return handler(response);});

    const userAccount = await wechatDB.collection('user').findOne({account, Authorization: result.Authorization});
    if (!userAccount) {
        await wechatDB.collection('user').insertOne(result);
    }
    await redis.set('user', {Authorization: result.Authorization});
    return returnData;
}

/**
 * 获取登录二维码
 */
async function postiPadLogin() {
    const returnData = {};
    const {Authorization, wcId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/iPadLogin`, {wcId: wcId, type: 2}, {headers: {Authorization}}).then(response => {return handler(response);});
    const wId = result.wId;
    returnData.wId = wId;
    returnData.qrCodeUrl = result.qrCodeUrl;
    await wechatDB.collection('user').updateOne({account: config.get('account'), Authorization}, {$set: {wId}});
    return returnData;
}

/**
 * 
 * @param {登录实例id} wId 
 * @param {认证信息} Authorization 
 */
async function getIsOnline() {
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/isOnline`, {wId}, {headers: {Authorization}}).then(response => {return handler(response);});
    const returnData = result.isOnline;
    if (!returnData)  {mailer(); logger.warn('off line');}
    return returnData;
}

/**
 * 保存目标群组消息
 */
async function saveAimcircle() {

}

async function queryLoginWx() {
    let returnData = {};
    const {Authorization} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/queryLoginWx`, {}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    for (let i of result) {
        await wechatDB.collection('user').updateOne({wId: i.wId}, {$set: {wcId: i.wcId}});
    }
    return returnData;
}

async function secondLogin() {
    let returnData = {};
    const {Authorization, wcId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/secondLogin`, {wcId, type: 2}, {headers: {Authorization}}).then(response => {return handler(response);});
    await wechatDB.collection('user').updateOne({Authorization}, {$set: {wId: result.wId}});
    await wechatDB.collection('userInfo').updateOne({wcId}, {$set: {wId: result.wId}});    
    returnData = result;
    return returnData;
}

/**
 * 获取登录信息 扫描二维码后需获取
 */
async function getIPadLoginInfo() {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getIPadLoginInfo`, {wId}, {headers: {Authorization}}).then(response => {return handler(response);});
    await wechatDB.collection('userInfo').updateOne({wcId: result.wcId}, {$set: result}, {upsert: true});
    await wechatDB.collection('user').updateOne({wId}, {$set: {wcIds: [result.wcId]}});
    returnData = result;
    await initAddressList();
    return returnData;
}

/**
 * 通讯录初始化
 */
async function initAddressList() {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/initAddressList`, {wId}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    await new Promise((resolve)=> {
        setTimeout(()=> {
            getAddressList();
            resolve();
        }, 4000);
    });
    return returnData || {};
}

/**
 * 获取通讯录
 */
async function getAddressList() {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getAddressList`, {wId}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    await wechatDB.collection('friends').updateOne({wId}, {$set: result}, {upsert: true});
    return returnData || {};
}

/**
 * 获取标签列表
 */
async function getContactLabelList() {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getContactLabelList`, {wId}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData.labelList = result;
    returnData.wId = wId;
    await wechatDB.collection('friends').updateOne({wId}, {$set: returnData}, {upsert: true});
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
    const result = await axios.post(`${host}/getLabelContacts`, {wId, labelId}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData.list = result;
    return returnData || {};
}

/**
 * 保存肉鸡的朋友圈
 */
async function getRoujiFriendCircle() {
    // 掉线
    if (!(await getIsOnline())) {
        logger.warn('wechat is not online');
        return {};
    }
    let returnData = {count: 0};
    const {list} = await getLabelContacts('1');
    for (let i of list) {
        const results = await getFriendCircle(i.userName);
        for (let sns of results.sns) {
            const md5 = crypto.createHash('md5').update(JSON.stringify(sns.id)).digest('hex');
            sns.md5 = md5;
            sns.firstPageMd5 = results.firstPageMd5;
            const frientCircleContent = await wechatDB.collection('frientCircleSNS').findOne({md5});
            if (!frientCircleContent) {
                sns.send = false;
                await wechatDB.collection('frientCircleSNS').insertOne(sns);
                returnData.count += 1;
            }
        }
    }
    return returnData;
}

/**
 * 获取好友的朋友圈
 * @param {好友微信id} wcId 
 */
async function getFriendCircle(wcId, firstPageMd5, maxId) {
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/getFriendCircle`, {wId, wcId, firstPageMd5, maxId}, {headers: {Authorization}}).then(response => {return handler(response);});
    return result;
}

/**
 * 发送消息到冲冲冲
 * @param {群id} chatRoomId 
 */
async function postRoujiFriendCircleToRoom() {
    const chatRoomId = '20474388408@chatroom';
    const returnData = {count: 0};
    // 掉线
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')}); 
    if (!(await getIsOnline(wId, Authorization))) {
        logger.info('wechat is not online');
        return {};
    }
    const time = new Date(new Date().toLocaleDateString()).getTime();
    const contents = await wechatDB.collection('frientCircleSNS').find({send: false, createTime: {$gte: time / 1000}}).toArray();
    for ( let content of contents) {
        const jsonData = await new Promise((resolve) => {
            parser.parseString(content.objectDesc.xml, (err, result) => {
                return resolve(result.TimelineObject) ;             
            });
        });
        await wechatDB.collection('frientCircleSNS').updateOne({md5: content.md5}, {$set: {send: true}});
        content = jsonData.contentDesc[0];
        await new Promise((resolve) => {
            setTimeout(async()=> {
                const result = await axios.post(`${host}/sendText`, {wId, wcId: chatRoomId, content}, {headers: {Authorization}}).then(response => {return handler(response);});
                resolve(result);
                returnData.count += 1;
            },  Math.random() * 5000);
        });
    }
    return returnData;
}
async function postCreateChatroom(){
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const userList = 'liwenbin5242,wxid_g2kxlsivy8x412';
    const result = await axios.post(`${host}/createChatroom`, {wId, userList, topic: '冲冲冲'}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    return returnData || {};
}

/**
 * 发送文本消息
 */
async function postSendText(data) {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/sendText`, {wId, wcId: data.wcId, content: data.content}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    return returnData || {status: 'failed'};
}

/**
 * 发送图片消息
 */
async function postSendImage(data) {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/sendImage`, {wId, wcId: data.wcId, content: data.content}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    return returnData || {};
}

/**
 * 发送文件消息
 */
async function postSendFile(data) {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/sendFile`, {wId, wcId: data.wcId, path: data.path, fileName: data.fileName}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    return returnData || {};
}

/**
 * 删除好友
 */
async function postDelContact(data) {
    let returnData = {};
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/delContact`, {wId, wcId: data.wcId}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    return returnData || {};
}

/**
 * 添加好友
 */
async function postAcceptUser(data) {
    let returnData = {};
    logger.info(data);
    const {Authorization, wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const result = await axios.post(`${host}/acceptUser`, {wId, v1: data.v1, v2: data.v2, type: data.type}, {headers: {Authorization}}).then(response => {return handler(response);});
    returnData = result;
    return returnData || {};
}

/**
 * 登录平台
 */
async function wkLogin() {
    const user = await redis.get('user');
    if (!user) {
        await postMemberLogin();
    }
}
module.exports = {
    postMemberLogin,
    postiPadLogin,
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
    postCreateChatroom,
    postSendText,
    postSendImage,
    postSendFile,
    postDelContact,
    postAcceptUser,
    wkLogin
};