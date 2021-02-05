const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');

const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const wechatServ = require('./wechat');
const {logger} = require('../utils/logger');
const config = require('config');
const enums = require('../lib/enums');

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
    // 发送消息到冲冲冲
    const msgData = {
        content: `来自: ${jsonData.msg.$.fromusername} 的好友添加请求,请求备注:${reqData.data.remark}。消息id:${reqData.data.msgId} 请及时处理!!`,
        wcId: '20474388408@chatroom'
    };
    await wechatServ.postSendText(msgData);
    return jsonData;
}

/**
 * 处理群文本消息
 * @param {*} data 
 */
async function roomTextMsg(data) {
    let content = data.data.content;
    let mentioned = content.includes(config.get('myName'));
    let reqData = {}, message = {};
    if (!mentioned) return;
    content = content.replace(config.get('myName'), '');
    let action = content.split(':');
    logger.info(content, 'content');
    logger.info(action, 'action');
    if (action.length < 2) return;
    switch (action[0].trim()) {
    case enums.autoReplyKeyWords.Reply:
        content = content.replace(':', '');
        content = content.split(' ');
        reqData.wcId = content[0];
        reqData.content = content[1];
        await wechatServ.postSendText(reqData);
        break;
    case enums.autoReplyKeyWords.Add:
        message = await wechatDB.collection('messages').findOne({
            messageType: enums.messageCodes.FriendRequest, 'data.msgId': parseInt(action[1])
        });
        if (!message) break;
        reqData = {
            v1: message.data.v1,
            v2: message.data.v2,
            type: message.data.scene
        };
        await wechatServ.postAcceptUser(reqData);
        await wechatServ.postSendText({
            wcId: '20474388408@chatroom',
            content: '好友添加完成!'
        });
        break;
    }
    return;
}

/**
 * 处理私聊消息
 * @param {*} data 
 */
async function dealPrivateMsg(data) {

}
module.exports = {
    dealFriendRequest,
    roomTextMsg,
    dealPrivateMsg
};