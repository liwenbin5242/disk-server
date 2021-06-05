const express = require('express');
const router = express.Router();

const returnCode = require('../utils/returnCodes');
const {reqHandler} = require('../utils/reqHandler');

const wechatServ = require('../modules/wechat');

/* 登录获取Authorization*/
router.post('/member/login', reqHandler(async function(req, res) {
    const {account, password} = req.body;
    const result = await wechatServ.postMemberLogin(account, password);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * get Qrcode
 */
router.post('/iPadLogin', reqHandler(async function(req, res) {
    const result = await wechatServ.postiPadLogin();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * login
 */
router.post('/getIPadLoginInfo', reqHandler(async function(req, res) {
    const result = await wechatServ.getIPadLoginInfo();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * 初始化通讯录列表
 */
router.post('/initAddressList', async function(req, res) {
    const result = await wechatServ.initAddressList();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 获取通讯录列表（好友、群、公众号）
 */
router.post('/getAddressList', async function(req, res) {
    const result = await wechatServ.getAddressList();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 获取标签列表
 */
router.post('/getContactLabelList', async function(req, res) {
    const result = await wechatServ.getContactLabelList();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 获取标签下的联系人
 */
router.post('/getLabelContacts', async function(req, res) {
    const result = await wechatServ.getLabelContacts('1');
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 二次登录（退出微信号/微信被踢掉线后，需要再次登录调用此接口即可 ）
 */
router.post('/secondLogin', async function(req, res) {
    const result = await wechatServ.secondLogin();
    const code = result.data;
    res.json(code);
});

/**
 * 获取肉鸡好友朋友圈
 */
router.post('/getRoujiFriendCircle', async function(req, res) {
    const result = await wechatServ.getRoujiFriendCircle();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 查询微信是否在线
 */
router.post('/isOnline', async function(req, res) {
    const result = await wechatServ.getIsOnline(req.body.wId, req.header.authorization);
    return res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 查询微信是否在线
 */
router.post('/queryLoginWx', async function(req, res) {
    const result = await wechatServ.queryLoginWx();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 发送消息到冲冲冲
 */
router.post('/RoujiFriendCircleToRoom', async function(req, res) {
    const result = wechatServ.postRoujiFriendCircleToRoom();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 建群
 */
router.post('/createChatroom', async function(req, res) {
    const result = wechatServ.postCreateChatroom();
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 发送消息
 */
router.post('/sendText', async function(req, res) {
    const result = await wechatServ.postSendText(req.body);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 发送消息
 */
router.post('/sendImage', async function(req, res) {
    const result = wechatServ.postSendImage(req.body);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 发送消息
 */
router.post('/sendFile', async function(req, res) {
    const result = wechatServ.postSendFile(req.body);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 删除好友
 */
router.post('/delContact', async function(req, res) {
    const result = wechatServ.postdelContact(req.body);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

/**
 * 同意添加好友
 */
router.post('/acceptUser', async function(req, res) {
    const result = wechatServ.postacceptUser(req.body);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
});

module.exports = router;
