'use strict';
const express = require('express');
const router = express.Router();
const diskServ = require('../modules/disk');
const returnCode = require('../utils/returnCodes');
const { reqHandler } = require('../utils/reqHandler');

/* 获取网盘用户信息*/
router.get('/userinfo', reqHandler(async function(req, res) {
    const result = await diskServ.getUserinfo(req.user.username);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/* 获取网盘容量信息*/
router.get('/diskinfo', reqHandler(async function(req, res) {
    const result = await diskServ.getDiskinfo(req.user.username);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/* 获取网盘文件列表*/
router.get('/disklist', reqHandler(async function(req, res) {
    const result = await diskServ.getDisklist(req.user.username);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/* 获取网盘递归文件列表*/
router.get('/disklistall', reqHandler(async function(req, res) {
    const path = req.query.path || '/'
    const result = await diskServ.getDisklistall(req.user.username, path);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/* 搜索文件*/
router.get('/file', reqHandler(async function(req, res) {
    const key = req.query.key || ''; 
    const dir = req.query.dir; 
    const result = await diskServ.getDisklistall(req.user.username, key, dir);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

module.exports = router;
