
const {logger} = require('../utils/logger');
function getMsg(data) {
    logger.info(JSON.stringify(data));
}

module.exports = {
    getMsg
};