'use strict';
const config = require('config');
const axios = require('axios');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const wechatServ = require('../modules/wechat');

const {logger} = require('../utils/logger');
const {handler} = require('../utils/handler');
const mongodber = require('../utils/mongodber');

const wechatDB = mongodber.use('wechat');
const moment = require('moment');
const fs = require('fs');

moment.locale('zh-cn');

/**
 * 定时将每日朋友圈更新到rush
 */
async function text2rush() {
    const time = parseInt(((new Date).getTime() - 24 * 60 * 60 * 1000) / 1000);
    const todayFriendSNS = await wechatDB.collection('frientCircleSNS').find({createTime: {$gte: time}}).toArray();
    let str = '';
    for ( let sns of todayFriendSNS) {
        // 解析xml数据
        const jsonData = await new Promise((resolve) => {
            parser.parseString(sns.objectDesc.xml, (err, result) => {
                return resolve(result);             
            });
        });
        str += (jsonData.TimelineObject.contentDesc[0] + '\n\n');
    }
    await fs.writeFileSync(`./public/${moment().format('YYYY-MM-DD')}.txt`, str);
    await wechatServ.postSendFile({wcId: '20474388408@chatroom', path: `${config.get('app.url')}/${moment().format('YYYY-MM-DD')}.txt`, fileName: '昨日朋友圈文本'});
}

module.exports = {
    text2rush
};