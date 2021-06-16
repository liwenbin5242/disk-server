'use strict';
const puppeteer = require('puppeteer');

const moment = require('moment');
const {logger} = require('../utils/logger');

moment.locale('zh-cn');

/**
 * 获取浏览器截图
 */
async function getImgs(url) {
    
    const browser = await puppeteer.launch({
        devtools: true,
        headless: false, 
        slowMo: 250, // 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const ck = {
        name: 'STOKEN',
        value: '8e28505d0d2ac35c49f8d84b41ed66ac74b5f77f4a7f7750e3963ce455df4b05',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck1 = {
        name: 'TIEBAUID',
        value: 'b4e1143586d389a8797d34e0',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck2 = {
        name: 'TIEBA_USERTYPE',
        value: '6bec7c8d172d59028b359d6a',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck3 = {
        name: 'csrfToken',
        value: '17HMGTVMpBM3N7F1BpSpFGyb',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck4 = {
        name: 'PASSID',
        value: 'pHPxkP',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck5 = {
        name: 'UBI',
        value: 'fi_PncwhpxZ%7ETaJcxZGCsm6yAiwJvenSyP6qbF%7EKzm0NpM295Mnx%7E236N5kMCC5x43Qc6OEAXxVNhggb1Mt',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck6 = {
        name: 'BDUSS',
        value: 'nBzcnBnQ3pVOUpSemdoaUZ0QWtoVFNUfi1EN2F-R2ZwdlZDVmpySzJGQ0N3T2xnRVFBQUFBJCQAAAAAAAAAAAEAAABVekyUZWc0NDAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIIzwmCCM8JgR',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck7 = {
        name: 'PTOKEN',
        value: '3c075dd76853ea7609cfdbe5f539d8c0',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck8 = {
        name: 'pplogid',
        value: '296455kXeLIOTLrt7%2BQjhTdAmVJM%2BRlgBsLr676DkVyRvV6EbzQreFu%2FmBjhYWVxllPDMUqThLafE7na5AI3IsbCcCIaMz%2FIjzaVpjGLn%2BGFpSQ%3D',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck9 = {
        name: 'BAIDUID',
        value: 'D9A2E6416B5D4C99DA2C728E761841C4:FG=1',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    const ck10 = {
        name: 'Hm_lvt_90056b3f84f90da57dc0f40150f005d5',
        value: '1623338082',
        domain: '.baidu.com',
        path: '/',
        expires: (Date.now() + 3600 * 1000 * 24) / 1000,
    };
    try {
        await page.goto(url);
        await page.setCookie(ck, ck1, ck2, ck3, ck4, ck5, ck6, ck7, ck8, ck9, ck10);
        await new Promise((resolve)=> {
            setTimeout(()=> {
                console.log(1);
                return resolve();
            }, 3000);
        });
        await page.reload();
        await page.goto('https://tieba.baidu.com/f?ie=utf-8&kw=%E5%88%9D%E4%B8%AD%E8%8B%B1%E8%AF%AD#sub');
        const title = await page.waitForXPath('//*[@id="tb_rich_poster"]/div[3]/div[1]');
        await title.click();
        await page.keyboard.type('测试标题');
        const content = await page.waitForXPath('//*[@id="tb_rich_poster"]/div[3]/div[2]/div[2]/div');
        await content.click();
        await page.keyboard.type('测试内容，自动发送测试已然完成，接下来可以接入批量发帖逻辑 ');
        const Botton = await page.waitForXPath('//*[@id="tb_rich_poster"]/div[3]/div[5]/div/button[1]');
        await Botton.click();
       
    } catch (err) {
        logger.error(err.message);
    }

}
module.exports = {
    getImgs
};