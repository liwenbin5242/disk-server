'use strict';
const puppeteer = require('puppeteer');

const moment = require('moment');
const {logger} = require('../utils/logger');

moment.locale('zh-cn');

/**
 * 获取浏览器截图
 */
async function getImgs(url) {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    page.setViewport({width: 920, height: 1250}); // 设置视窗大小为 920*1250 适应手机尺寸
    const now = Date.now();
    try {
        await page.goto(url);
        await page.screenshot({ path: `./public/${now}.png`});
        return `http://81.70.203.247:3000/${now}.png`;
    } catch (err) {
        logger.err(err.message);
    }

}
module.exports = {
    getImgs
};