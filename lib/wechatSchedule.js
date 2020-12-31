const schedule = require('node-schedule');
const wechatServ = require('../modules/wechat');

/**
 * 定时任务
 */
async function wechatSchedule() {
    console.log('wechatSchedule server start')
    // 检测是否在线
    schedule.scheduleJob('30 * * * *', await wechatServ.getIsOnline());

    // 更新目标朋友圈数据
    schedule.scheduleJob('30 * * * *', await wechatServ.saveAimcircle());

}

module.exports = {
    wechatSchedule
}