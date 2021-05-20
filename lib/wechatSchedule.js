const schedule = require('node-schedule');
const wechatServ = require('../modules/wechat');
const nodebbServ = require('../modules/nodebb');
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
        // 当微信掉线时终端输出微信二维码登录
        schedule.scheduleJob('*/1 * * * * *', await wechatServ.getTerminalQRCode);

        // 定时任务登录微控平台
        schedule.scheduleJob('*/1 * * * * *', await wechatServ.wkLogin);
    } catch (err) {
        logger.error(err.message);
    }
}

module.exports = {
    wechatSchedule
};