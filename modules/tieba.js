const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');


/**
 * 外部接口调用,获取最新内容
 */
async function getText() {
     
}

/**
 * 外部接口调用,获取最新内容
 */
async function getTitle() {
    await wechatDB.collection('');
}

/**
 * 外部接口调用,获取沙发
 */
async function getSofa() {
    const 
}

module.exports = {
    getText,
    getTitle,
    getSofa
}