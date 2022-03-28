const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('config');
const urlencode = require('urlencode');
const axios = require('axios');

/**
 * argon2加密字符串
 */
async function argonEncryption(text) {
    const argonOptions = {
        type: argon2.argon2id, // 加密模式：argon2i/argon2d/argon2id
    };
    const argon2Hash = await argon2.hash(text, argonOptions);
    return argon2Hash; // 加密字符串
}
/**
 * argon2验证字符串
 */
async function argonVerification(text, encryptedText) {
    const verify = await argon2.verify(encryptedText, text);

    return verify; // 是否相同 true/false
}

/**
 * jwt解析
 */
async function decodeJwt(token) {
    const data = await jwt.verify(token, config.get('privateKey'));
    return data;
}

/**
 * jwt签名
 */
async function encodeJwt(payload) {
    try {
        const token = jwt.sign(payload, config.get('privateKey'));
        return token;
    } catch (err) {
        err;
    }

}

async function urlecodes(req, res, next) {
    for (let i in req.query) {
        req.query[i] = await urlencode(req.query[i]);
    }
    next();
}

/**
 * 百度网盘api
 */
const bdapis = {
    // 刷新access_token
    refreshToken: async (refresh_token) => { return await axios.get(`https://openapi.baidu.com/oauth/2.0/token?grant_type=refresh_token?&refresh_token=${refresh_token}&client_id=${config.get('BaiDuDisk.clientid')}&client_secret=${config.get('BaiDuDisk.clientsecret')}`); },
    // code换取token
    code2token: async (code) => { return await axios.get(`https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code=${code}&client_id=Xo5gDASeVZRxHArna5hviweIGkllqetf&client_secret=GVpNxBBQ3P79GTcGWPfnds5jk7Um6EM8&redirect_uri=http://disk.aassc.cn/oauth_redirect`); },
    // 通过access_token获取用户
    getbdUserByToken: async (access_token) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo&access_token=${access_token}`); },
    getQuotaByToken: async (access_token) => { return await axios.get(`https://pan.baidu.com/api/quota?access_token=${access_token}`); },
    getFileListByToken: async (access_token, dir, order, web, folder, showempty) => { 
        return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=list&access_token=${access_token}&dir=${dir}&order=${order}&web=${web}&folder=${folder}&showempty=${showempty}`); },
    getDocListByToken: async (access_token, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=doclist&access_token=${access_token}&parent_path=${parent_path}`); },
    getVideoListByToken: async (access_token, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=doclist&access_token=${access_token}&parent_path=${parent_path}`); },
    getBTListByToken: async (access_token, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=btlist&access_token=${access_token}&parent_path=${parent_path}`); },
    getCategoryListByToken: async (access_token, category, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/multimedia?method=categorylist&access_token=${access_token}&category=${category}&parent_path=${parent_path}`); },
    searchFileByToken: async (access_token, key, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=search&access_token=${access_token}&key=${key}&parent_path=${parent_path}&web=1`); },
    getFilemetasByToken: async (access_token, fsids,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&access_token=${access_token}&thumb=1&fsids=${fsids}&dlink=1&extra=1&needmedia=1`); },
};

async function promiseTasks(tasks, api) {
    let return_data = [];
    const promiseTasks = tasks.map(task => {
        return bdapis[api](task.access_token);
    });
    await Promise.all(promiseTasks).then(result => {
        return_data = result;
    });
    return return_data;
}
module.exports = {
    argonVerification,
    argonEncryption,
    decodeJwt,
    encodeJwt,
    urlecodes,
    bdapis,
    promiseTasks,
};