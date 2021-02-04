const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');
const _ = require('lodash');
const redis = require('../utils/rediser');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const wechatServ = require('./wechat');
const {logger} = require('../utils/logger');

/**
 * 
 * @param {*} data 
 */
async function dealFriendRequest(reqData) {
    const content = reqData.data.content;
    // 解析xml数据
    const jsonData = await new Promise((resolve) => {
        parser.parseString(content, (err, result) => {
            return resolve(result);             
        });
    });
    logger.info(JSON.stringify(jsonData));
    // 发送消息给我
    const msgData = {
        content: `来自${jsonData.fromusername}的好友添加请求，请及时处理!!`
    };
    await wechatServ.postSendText(msgData);
    return jsonData;
}

module.exports = {
    dealFriendRequest
};