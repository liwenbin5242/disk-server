const express = require('express');
const router = express.Router();
const config = require('config');
const host = config.get('host');
const axios = require('axios');

const md5 = require('crypto').createHash('md5');
const _ = require('lodash');

const wechat = require('../modules/wechat');
const mongodber = require('../utils/mongodber');
const wecahtDB = mongodber.use('wechat');

const wechatServ = require('../modules/wechat')

wecahtDB.collection('account').findOne({},(err, result) => {
    global.Authorization = result.Authorization;
    global.wId = result.wId;
});



const RESP = {
    code:0,
    data: {},
    msg:''
};
/* 登录获取Authorization*/
router.post('/member/login',async function(req, res, next) {
    const result = await axios.post(host+ req.path, req.body);
    Authorization = result.data.data.Authorization;
    await wecahtDB.collection('account').updateMany({},{$set:{Authorization}});
    res.json(RESP);
});

/**
 * get Qrcode
 */
router.post('/iPadLogin',async function(req, res, next) {
    const result = await axios.post(host+ req.path, req.body, {headers: {Authorization}});
    const code = result.data;
    wId = result.data.data.wId;
    await wecahtDB.collection('account').updateMany({},{$set:{wId}});
    res.json(code);
});

/**
 * login
 */
router.post('/getIPadLoginInfo',async function(req, res, next) {
    const result = await axios.post(host+ req.path, {wId}, {headers: {Authorization}});
    const code = result.data
    res.json(code)
});

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
    return wechatServ.getFriendCircle();
});

/**
 * 查询微信是否在线
 */
router.post('/isOnline',async function(req, res, next) {
    return wechatServ.getIsOnline(wId, Authorization);
});

module.exports = router;
