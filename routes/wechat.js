const express = require('express');
const router = express.Router();
const config = require('config');
const host = config.get('host');
const axios = require('axios');

const md5 = require('crypto').createHash('md5');
const _ = require('lodash');

const mongodber = require('../utils/mongodber');
const returnCode = require('../utils/returnCodes');
const {reqHandler} = require('../utils/reqHandler');
const {handler} = require('../utils/handler');
const wecahtDB = mongodber.use('wechat');

const wechatServ = require('../modules/wechat')


/* 登录获取Authorization*/
router.post('/member/login', reqHandler(async function(req, res, next) {
    const {account, password} = req.body;
    const result = await wechatServ.postMemberLogin(account, password);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * get Qrcode
 */
router.post('/iPadLogin', reqHandler(async function(req, res, next) {
    const result = await wechatServ.postiPadLogin();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * login
 */
router.post('/getIPadLoginInfo',reqHandler(async function(req, res, next) {
    const result = await wechatServ.getIPadLoginInfo()
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * 初始化通讯录列表
 */
router.post('/initAddressList',async function(req, res, next) {
    const result = await axios.post(host+ req.path, {wId}, {headers: {Authorization}});
    const code = result.data
    res.json(code)
});

/**
 * 获取通讯录列表（好友、群、公众号）
 */
router.post('/getAddressList',async function(req, res, next) {
    const result = await axios.post(host+ req.path, {wId}, {headers: {Authorization}});
    const code = result.data
    const friends = code.friends;
    for(let wcId of friends) {
        const friend = await wecahtDB.collection('friends').findOne({wcId: wcId});
        if(!friend) {

        }
    }
    res.json(code)
});

/**
 * 二次登录（退出微信号/微信被踢掉线后，需要再次登录调用此接口即可 ）
 */
router.post('/secondLogin',async function(req, res, next) {
    const result = await axios.post(host+ req.path, {wId, type:2}, {headers: {Authorization}});
    const code = result.data
    res.json(code)
});

/**
 * 获取好友朋友圈
 */
router.post('/getFriendCircle',async function(req, res, next) {
    return wechatServ.saveFriendCircle(wId, 'wxid_dl8pirdlyr7812', '', '',);
});

/**
 * 查询微信是否在线
 */
router.post('/isOnline',async function(req, res, next) {
    return wechatServ.getIsOnline(wId, Authorization);
});

/**
 * 查询微信是否在线
 */
router.post('/queryLoginWx',async function(req, res, next) {
    const result = wechatServ.queryLoginWx();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});
module.exports = router;
