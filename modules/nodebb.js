const axios = require('axios');
const {logger} = require('../utils/logger');
const mongodber = require('../utils/mongodber');
const wechatDB = mongodber.use('wechat');
const config = require('config');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

/**
 * 
 * @param {msg data} data 
 */
async function postTopic() {
    const snses = await wechatDB.collection('frientCircleSNS').find({send: false}).toArray();
    for (let sns of snses) {
        const jsonData = await new Promise((resolve) => {
            parser.parseString(sns.objectDesc.xml, (err, result) => {
                return resolve(result.TimelineObject);
            });
        });
        try {
            let title = jsonData.ContentObject[0].title[0] || jsonData.contentDesc[0];
            let content = jsonData.contentDesc[0];
            if (title.length < 8 ) {
                title = title + '!!!!!!!!';
            }
            if (title.length > 50) {
                title = title.slice(0, 30);
            }
            if (content.length < 8) {
                content = content + '!!!!!!!!';
            }
            const result = await axios.post(`${(config.get('DEDAO_SERV').url)}/api/v3/topics`, {
                uuid: '1a95db6a-f825-4299-b687-181cd0378804',
                title,
                content,
                thumb: '',
                cid: 1
            }, {headers: {
                'x-csrf-token': 'lfakIJ0K-VTOSaz_drcJKfAFbeowXn_XEsKA',
                cookie: '_csrf=WGUoO47ih_rRQJa-AX_TKFRR; SESSIONID=327b02a3-b010-49d1-8212-e221b00fec3e.lqaCwlFy1SP7mM214FttvJZTKqY; request_token=80IniIj2N76bsxIWLG1b3DF3WoBWxHbm8AYNnrPx7jt0iPQL; pro_end=-1; ltd_end=-1; serverType=nginx; order=id%20desc; memSize=1987; bt_user_info=%7B%22status%22%3Atrue%2C%22msg%22%3A%22%u83B7%u53D6%u6210%u529F%21%22%2C%22data%22%3A%7B%22username%22%3A%22158****5602%22%7D%7D; sites_path=/www/wwwroot; distribution=ubuntu; backup_path=/www/backup; network-unitType=KB/s; disk-unitType=KB/s; rank=list; depType=0; site_type=-1; cpuTotal=2836; cpuCount=1%20%u6838%u5FC3; cpuType=%u578B%u53F7%3AAMD%20EPYC%207K62%2048-Core%20Processor; diskTotal=1854; diskRead=Read%3A%20158%20MB; diskWrite=Write%3A%20151%20MB; #memTotal=1987%20MB; #Total=6677; SetId=mmpath; SetName=; vcodesum=8; ChangePath=34; path_dir_change=/home/ubuntu/NodeBB/; force=0; p10=3; p5=2; p7=3; p-1=1; p0=1not_load; load_search=undefined; load_page=3; load_type=10; softType=11; form_proxy=%5Bobject%20Object%5D; Path=/home/ubuntu; express.sid=s%3AmUyZ6Dw4pNL7wevWHKISMDfjgELblrUL.5qJZAS3WHyBLolOW4NsnCaSDwFhVc131LSVnP0uqY48'
            }});
            if (result.status === 200) {
                await wechatDB.collection('frientCircleSNS').updateOne({_id: sns._id}, {$set: {send: true}});
            }
            logger.info(result);
        } catch (err) {
            logger.error(jsonData);
            logger.error(sns._id.toString());
            await wechatDB.collection('frientCircleSNS').updateOne({_id: sns._id}, {$set: {send: 'err'}});
        }
    }
    return;
}

module.exports = {
    postTopic
};