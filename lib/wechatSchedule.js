const schedule = require('node-schedule');
const wechatServ = require('../modules/wechat');
const nodebbServ = require('../modules/nodebb');
const {logger} = require('../utils/logger');
/**
 * 定时任务
 */
async function wechatSchedule() {
    logger.log('wechatSchedule server start');
    try {
        // 30s同步一次肉鸡朋友圈信息
        schedule.scheduleJob('30 * * * * *', await wechatServ.getRoujiFriendCircle);
        // 1分钟同步一次
        schedule.scheduleJob('30 * * * * *', await nodebbServ.postTopic);
        // 30分钟检测是否在线
        schedule.scheduleJob('* 30 * * * *', await wechatServ.getIsOnline());
    } catch (err) {
        logger.err(err.message);
    }
}

module.exports = {
    wechatSchedule
};