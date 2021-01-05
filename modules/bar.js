const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');
const _ = require('lodash');
const { redis } = require('../utils/rediser');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
/**
 * 外部接口调用,发帖内容
 */
async function getText() {
    const content = await redis.set('content');
    return content;
}

/**
 * 外部接口调用,发帖标题
 */
async function getTitle() {
    const time = new Date(new Date().toLocaleDateString()).getTime();
    let contents = await wechatDB.collection('frientCircleSNS').find({createTime: {$gte: time / 1000}}).toArray();
    if (contents.length === 0) {
        contents = await wechatDB.collection('frientCircleSNS').find().toArray();
    }
    let content = _.shuffle(contents).shift();
    const jsonData = await new Promise((resolve) => {
        parser.parseString(content.objectDesc.xml, (err, result) => {
            return resolve(result.TimelineObject) ;             
        });
    });
    const title = jsonData.contentDesc[0];
    await redis.set('content', jsonData);
    return title;
}

/**
 * 外部接口调用,抢楼
 */
async function getSofa() {
     
}

module.exports = {
    getText,
    getTitle,
    getSofa
};