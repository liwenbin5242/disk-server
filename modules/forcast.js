'use strict';
const config = require('config');

const puppeteer = require('puppeteer');

const moment = require('moment');
const wechatServ = require('./wechat');

moment.locale('zh-cn');

/**
 * 发送天气信息
 */
async function sendForcast() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({width: 920, height: 1250}); // 设置视窗大小为 920*1250 适应手机尺寸
    for (let room of config.get('FORCAST_ROOMS')) {
        await page.goto(`http://weathernew.pae.baidu.com/weathernew/pc?query=${room.address.province}${room.address.city}天气&srcid=4982&city_name=${room.address.city}&province_name=${room.address.province}`);
        await page.screenshot({ path: `./public/${moment().format('YYYY-MM-DD')}.png` });
        await wechatServ.postSendImage({
            wcId: room.id,
            content: `http://81.70.203.247:3000/public/${moment().format()}.png`
        });
    }
}
module.exports = {
    sendForcast
};