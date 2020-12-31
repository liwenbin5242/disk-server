const config = require('config');
const axios = require('axios');
const host = config.get('host');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const handler = require('../utils/handler');

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
    account = account || config.get('account');
    password = password || config.get('password');
    const result = await axios.post(`${host}/member/login`, {account, password});
    const userAccount = await wecahtDB.collection('account').findOne({account});
    if (!userAccount) {
        await wecahtDB.collection('account').insert(result.data.data);
    }
    return {}
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
async function getIsOnline(wId, Authorization,) {

    const result = await axios.post(host+ '/isOnline', {wId}, {headers: {Authorization}}).then(handler);
    return result.isOnline
}

module.exports = {
    postMemberLogin,
    saveFriendCircle,
    getIsOnline
}