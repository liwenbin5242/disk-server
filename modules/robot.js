'use strict';
const {logger} = require('../utils/logger');
const enums = require('../lib/enums');

/**
 * 
 * @param {msg data} data 
 */
function getMsg(data) {
    switch (data.messageType) {
    case enums.MessageCodes.FriendRequest: 
        
    }
}

module.exports = {
    getMsg
};