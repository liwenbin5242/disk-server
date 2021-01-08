const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');
const _ = require('lodash');
const redis = require('../utils/rediser');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
/**
 * 外部接口调用,发帖内容
 */
async function getText() {
    const content = await new Promise((resolve)=> {
        redis.get('content', (err, result) => {
            resolve(result);
        });
    }); 
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
    const barcontent = getContextContent(jsonData.contentDesc[0]);
    
    const title =  getContextTitle(barcontent);
    await redis.set('content', barcontent);
    return title;
}

/**
 * 外部接口调用,抢楼
 */
async function getSofa() {
    const a = ['哇塞我好想要','我想要','哇塞我'].shuffle().shuffle()
    return `${a}想要课程++😘egg4402就对了`
}

function getContextTitle(context) {
    const sign1 = '《';
    const sign2 = '》';
    const sign3 = '【';
    const sign4 =  '】';
    const a1 = context.split(sign1);
    for (let i of a1) {
        if (i.includes(sign2)) {
            return i.split(sign2)[0];
        }
    }
    const a2 = context.split(sign3);
    for (let i of a2) {
        if (i.includes(sign4)) {
            return i.split(sign4)[0];
        }
    }
    return context.split(0, 20);
}

function getContextContent(context) {
    console.log(context);
    let arr = ['会员', '免费', '元'];
    for (let a of arr) {
        context = context.replace(new RegExp(a, 'gm'), '');
        context = context.replace(new RegExp('/n', 'gm'), ' ');
    }
    return context;
}

module.exports = {
    getText,
    getTitle,
    getSofa
};