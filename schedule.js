const schedule = require('node-schedule');
const wechatServ = require('./modules/wechat');

/**
 * 定时任务
 */
async function wechatSchedule() {
    // 检测是否在线
    schedule.scheduleJob('30 * * * *',wechatServ.getIsOnline(wId, Authorization));

    // 

}

module.exports = {
    wechatSchedule
}