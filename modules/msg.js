
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
    case enums.messageCodes.FriendRequest: 
        logger.info('friend requset');
        await logicServ.dealFriendRequest(data);
        break;
    case enums.messageCodes.RoomMsg: 
        logicServ.dealRoomMsg(data);
        break;
    case enums.messageCodes.RoomTextMsg:
        logicServ.roomTextMsg(data);
        break;
    }
    return;
}

module.exports = {
    getMsg
};