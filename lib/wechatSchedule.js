const schedule = require('node-schedule');
const wechatServ = require('../modules/wechat');
const forcastServ = require('../modules/forcast');
const {logger} = require('../utils/logger');
/**
 * 定时任务
 */
async function wechatSchedule() {
    logger.info('wechatSchedule server start');
    try {
        // 每分钟同步一次肉鸡朋友圈信息
        schedule.scheduleJob('0 */1 * * * *', await wechatServ.getRoujiFriendCircle);
        // 每分钟同步一次肉鸡朋友圈信息
        // schedule.scheduleJob('0 */1 * * * *', await wechatServ.getRoujiFriendCircle);
        // 每分钟同步一次肉鸡朋友圈信息
        // schedule.scheduleJob('0 */1 * * * *', await wechatServ.getRoujiFriendCircle);
        // 每两分钟转发一次朋友圈
        schedule.scheduleJob('30 */2 * * * *', await wechatServ.forwardSns);
        // 每同步一次标签列表
        schedule.scheduleJob('0 0 */12 * * *', await wechatServ.getContactLabelList);

        // schedule.scheduleJob('30 * * * * *', await nodebbServ.postTopic);
        // 每分钟检测是否在线
        schedule.scheduleJob('0 */1 * * * *', await wechatServ.getIsOnline);
        // 发送天气预报
        schedule.scheduleJob('0 0 8 * * *', await forcastServ.sendForcast);
    } catch (err) {
        logger.error(err.message);
    }
}

module.exports = {
    wechatSchedule
};