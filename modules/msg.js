'use strict';
const {logger} = require('../utils/logger');
const enums = require('../lib/enums');
const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');

const logicServ = require('./logic');
/**
 * deal msg
 * @param {msg data} data 
 */
async function getMsg(data) {
    wechatDB.collection('messages').insertOne(data);
    switch (data.messageType) {
    case enums.MessageCodes.FriendRequest: 
        logger.info('friend requset');
        // await logicServ.dealFriendRequest(data);
        break;
    case enums.MessageCodes.RoomMsg: 
        // logicServ.dealRoomMsg(data);
        break;
    case enums.MessageCodes.PrivateChat: 
        // logicServ.dealPrivateMsg(data);
        break;
    case enums.MessageCodes.RoomTextMsg:
        // logicServ.roomTextMsg(data);
        break;
    }
    return;
}

module.exports = {
    getMsg
};