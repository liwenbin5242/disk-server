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

/* 用户登录获取token*/
router.get('/info', reqHandler(async function(req, res) {
    res.json({code: returnCode.SUCCESS, data: req.user, msg: ''});
}));

/*用户通过code换取access_token和refresh_token */
router.post('/disk/code', reqHandler(async function(req, res) {
    const {username, code} = req.body;
    const result = await userServ.bindDisk(username, code);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));
module.exports = router;
