'use strict';
const express = require('express');
const router = express.Router();
const userServ = require('../modules/user');
const returnCode = require('../utils/returnCodes');
const { reqHandler } = require('../utils/reqHandler');

/* 用户注册*/
router.post('/register', reqHandler(async function(req, res) {
    const {username, password} = req.body;
    const result = await userServ.postUserRegister(username, password);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/* 用户登录获取token*/
router.post('/login', reqHandler(async function(req, res) {
    const {username, password} = req.body;
    const result = await userServ.postUserLogin(username, password);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/* 用户登出*/
router.post('/logout', reqHandler(async function(req, res) {
    const {username, password} = req.body;
    // const result = await userServ.postUserLogout(username, password);
    res.json({code: returnCode.SUCCESS, data: {}, msg: ''});
}));

/* 获取用户基本信息*/
router.get('/info', reqHandler(async function(req, res) {
    const result = await userServ.getUserInfo(req.user.username);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/* 获取用户关联网盘信息*/
router.get('/disks', reqHandler(async function(req, res) {
    const result = await userServ.getUserDisks(req.user.username);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/*用户通过code换取access_token和refresh_token */
router.post('/disks/code', reqHandler(async function(req, res) {
    const {code} = req.body;
    const result = await userServ.bindDisk(req.user.username, code);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));


module.exports = router;
