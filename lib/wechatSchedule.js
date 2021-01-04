const schedule = require('node-schedule');
const wechatServ = require('../modules/wechat');

/**
 * 定时任务
 */
async function wechatSchedule() {
    console.log('wechatSchedule server start')
    // 30分钟同步一次肉鸡朋友圈信息
    schedule.scheduleJob('* */3 * * * *', await wechatServ.getRoujiFriendCircle());

    // 30分钟同步新消息到冲冲冲
    schedule.scheduleJob('* */5 * * * *', await wechatServ.postRoujiFriendCircleToRoom('20474388408@chatroom'));

}

module.exports = {
    wechatSchedule
}