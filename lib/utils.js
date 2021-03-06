const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('config');
const urlencode = require('urlencode');
const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');

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
        const token = jwt.sign(payload, config.get('privateKey'), {expiresIn: '12h'});
        return token;
    } catch (err) {
        err;
    }

}

/**
 * @function md5
 * @param {*} data - 需要进行md5 hash的数据
 * @param {string} [digest='hex'] - 编码格式,默认为hex
 * @param {number} [start=4] - slice开始位,默认为4
 * @param {end} [end=-4] - slice结束位,默认为-4
 * @return md5后的字符串
 */
async function md5(data,digest,start,end) {
    return crypto.createHash('md5')
        .update(data, 'utf8')
        .digest(digest || 'hex')
        .slice(start || 4, end || -4);
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
    getbdUserByToken: async (access_token) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo&access_token=${access_token}`) },
    // 获取网盘容量信息
    getQuotaByToken: async (access_token) => { return await axios.get(`https://pan.baidu.com/api/quota?access_token=${access_token}`) },
    // 获取文件列表
    getFileListByToken: async (access_token, dir, order, web, folder, showempty) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=list&access_token=${access_token}&dir=${dir}&order=${order}&web=web&folder=${folder}&showempty=${showempty}`) },
    // 获取文档列表
    getDocListByToken: async (access_token, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=doclist&access_token=${access_token}&parent_path=${parent_path}`) },
    // 获取视频列表
    getVideoListByToken: async (access_token, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=doclist&access_token=${access_token}&parent_path=${parent_path}`) },
    // 获取bt列表
    getBTListByToken: async (access_token, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=btlist&access_token=${access_token}&parent_path=${parent_path}`) },
    // 获取分类文件列表
    getCategoryListByToken: async (access_token, category, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/multimedia?method=categorylist&access_token=${access_token}&category=${category}&parent_path=${parent_path}`) },
    // 搜索文件
    searchFileByToken: async (access_token, key, parent_path,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/file?method=search&access_token=${access_token}&key=${key}&parent_path=${parent_path}&web=1`) },
    // 查询文件信息
    getFilemetasByToken: async (access_token, fsids,) => { return await axios.get(`https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&access_token=${access_token}&thumb=1&fsids=${fsids}&dlink=1&extra=1&needmedia=1`) },
    // 管理文件
    fileManager : async (access_token, opera, filelist) => { return await axios({
        url: `http://pan.baidu.com/rest/2.0/xpan/file?method=filemanager&opera=${opera}&access_token=${access_token}`,
        method:'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
            opera,
            async: 1,
            filelist
        }) 
    })},
}

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
    bdapis,
    decodeJwt,
    encodeJwt,
    md5,
    promiseTasks,
    urlecodes,
};