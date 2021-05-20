const schedule = require('node-schedule');
const wechatServ = require('../modules/wechat');
const {logger} = require('../utils/logger');
/**
 * 定时任务
 */
async function wechatSchedule() {
    logger.info('wechatSchedule server start');
    try {
        // 30s同步一次肉鸡朋友圈信息
        // schedule.scheduleJob(' * * * * *', await wechatServ.getRoujiFriendCircle);
        // 1分钟同步一次
        // schedule.scheduleJob('30 * * * * *', await nodebbServ.postTopic);
        // 30分钟检测是否在线
        // schedule.scheduleJob('* 30 * * * *', await wechatServ.getIsOnline);

    } catch (err) {
        logger.error(err.message);
    }
}

module.exports = {
    wechatSchedule
};