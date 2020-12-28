const config = require('config');
const host = config.get('host');
const xml2js = require('xml2js');
const handler = require('../utils/handler');
/**
 * 
 * @param {登录实例id} wId 
 * @param {好友微信id} wcId 
 * @param {首页md5} firstPageMd5 
 * @param {} maxId 
 */
async function getFriendCircle(wId, wcId, firstPageMd5, maxId) {
    const result = await axios.post(host+ req.path, {wId, wcId, firstPageMd5, maxId}, 
        {headers: {Authorization}}).then(handler);
    return result.data
}

/**
 * 
 * @param {登录实例id} wId 
 * @param {认证信息} Authorization 
 */
async function getIsOnline(wId, Authorization,) {

    const result = await axios.post(host+ '/isOnline', {wId}, {headers: {Authorization}}).then(handler);
    return result.isOnline
}


module.exports = {
    getFriendCircle,
    getIsOnline
}