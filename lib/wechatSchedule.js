const schedule = require('node-schedule');
const wechatServ = require('../modules/wechat');
const {logger} = require('../utils/logger');
/**
 * 定时任务
 */
async function wechatSchedule() {
    logger.log('wechatSchedule server start');
    try {
        // 1分钟同步一次肉鸡朋友圈信息
        schedule.scheduleJob('30 * * * * *',  await wechatServ.getRoujiFriendCircle);
        // 5分钟同步新消息到冲冲冲
        // schedule.scheduleJob('1 * * * * *', await wechatServ.postRoujiFriendCircleToRoom);
    } catch (err) {
        logger.err(err.message);
    }
}

module.exports = {
    wechatSchedule
};