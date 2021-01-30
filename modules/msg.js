
const {logger} = require('../utils/logger');
const enums = require('../lib/enums');
const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');

const logicServ = require('./logic');
/**
 * deal msg
 * @param {msg data} data 
 */
function getMsg(data) {
    wechatDB.collection('messages').insertOne(data);
    switch (data.messageType) {
    case enums.messageCodes.FriendRequest: 
        logicServ.dealFriendRequest();
    }
}

module.exports = {
    getMsg
};