const schedule = require('node-schedule');
const wechatServ = require('../modules/wechat');

/**
 * 定时任务
 */
async function wechatSchedule() {
    console.log('wechatSchedule server start')
    try {
    // 1分钟同步一次肉鸡朋友圈信息
    schedule.scheduleJob('1 * * * * *',  await wechatServ.getRoujiFriendCircle);
    // schedule.scheduleJob('1 30 * * * *', await getRoujiFriendCircle);
    // 5分钟同步新消息到冲冲冲
    schedule.scheduleJob('1 * * * * *', await wechatServ.postRoujiFriendCircleToRoom('20474388408@chatroom'));

    } catch (err) {

    }
}

module.exports = {
    wechatSchedule
}