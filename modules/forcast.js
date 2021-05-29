const config = require('config');
const enums = require('../lib/enums');
const axios = require('axios');
const crypto = require('crypto');

const host = config.get('host');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const {logger} = require('../utils/logger');
const {handler} = require('../utils/handler');

const mongodber = require('../utils/mongodber');
const redis = require('../utils/rediser');
const wechatDB = mongodber.use('wechat');
const mailer = require('../scripts/mailer');
const moment = require('moment');
const wechatServ = require('./wechat');

moment.locale('zh-cn');

/**
 * 发送天气信息
 */
async function sendForcast( ) {
    const {wId} = await wechatDB.collection('user').findOne({account: config.get('account')});
    const forcast = await axios.get('https://assets.msn.com/service/weather/overview?apikey=UhJ4G66OjyLbn9mXARgajXLiLw6V75sHnfpU60aJBB&activityId=4D50A0B2-21C6-49DD-81FE-1EB444880656&ocid=weather-peregrine&market=CN&user=m-11ABFCFD40A168131B25F2A944A16B01&locale=zh-cn&inclup=1&lat=34.7472&lon=113.625&units=C&region=cn&appId=4de6fc9f-3262-47bf-9c99-e189a8234fa2&wrapodata=false&regioncategories=alert&distanceinkm=10&regionDataCount=10&orderby=distance&days=5&pageOcid=anaheim-ntp-peregrine&source=greeting1');
    const data = forcast.data.responses[0].weather[0];

    // for (let chatroom of chatrooms) {
    let content = `当前天气:${data.current.capAbbr},风力:${data.current.pvdrWindDir} ${data.current.pvdrWindSpd},温度:${data.current.temp}摄氏度,空气质量:${data.current.aqiSeverity}\n\n`;

    for (let forecast of data.forecast.days) {
        content += `${moment(forecast.daily.valid).format('YYYY年MM月DD日')}: 天气:${forecast.daily.pvdrCap} 风力:${forecast.daily.pvdrWindDir} ${forecast.daily.pvdrWindSpd}, 温度:${forecast.daily.tempLo}-${forecast.daily.tempHi}摄氏度\n\n`;
    }
    await wechatServ.postSendText({
        wcId: '18628314657@chatroom',
        content: content
    });
    await wechatServ.postSendText({
        wcId: '20950390928@chatroom',
        content: content
    });
    
    // }
}
module.exports = {
    sendForcast
};