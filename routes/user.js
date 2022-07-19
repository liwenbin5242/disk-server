'use strict';
const express = require('express');
const router = express.Router();
const userServ = require('../modules/user');
const returnCode = require('../utils/returnCodes');
const { reqHandler } = require('../utils/reqHandler');

/**
 * @api {post} /user/register 01.用户注册
 * @apiName 用户注册
 * @apiGroup 用户模块
 *
 * @apiParam {String} username 用户名.
 * @apiParam {String} password 密码.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.post('/register', reqHandler(async function(req, res) {
    const {username, password} = req.body;
    const result = await userServ.postUserRegister(username, password);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/**
 * @api {post} /user/login 02.用户登录获取token
 * @apiName 用户登录
 * @apiGroup 用户模块
 *
 * @apiParam {String} username 用户名.
 * @apiParam {String} password 密码.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.post('/login', reqHandler(async function(req, res) {
    const {username, password} = req.body;
    const result = await userServ.postUserLogin(username, password);
    return res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/**
 * @api {post} /user/logout 03.用户登出
 * @apiName 用户登出
 * @apiGroup 用户模块
 *
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.post('/logout', reqHandler(async function(req, res) {
    // const {username, password} = req.body;
    // const result = await userServ.postUserLogout(username, password);
    res.json({code: returnCode.SUCCESS, data: {}, message: true});
}));

/**
 * @api {get} /user/info 04.获取用户基本信息
 * @apiName 获取用户基本信息
 * @apiGroup 用户模块
 *
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
 router.get('/info', reqHandler(async function(req, res) {
    const result = await userServ.getUserInfo(req.user.username);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/**
 * @api {post} /user/info 05.修改用户基本信息
 * @apiName 获取用户基本信息
 * @apiGroup 用户模块
 * @apiParam {String} avatar 
 * @apiParam {String} name 
 * @apiParam {String} phone 
 * 
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
 router.post('/info', reqHandler(async function(req, res) {
    const { avatar,name, phone} = req.body;
    const result = await userServ.updateUserInfo(req.user.username, avatar,name, phone);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/**
 * @api {get} /user/disks 06.获取用户关联网盘信息
 * @apiName 获取用户关联网盘信息
 * @apiGroup 用户模块
 *
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */

router.get('/disks', reqHandler(async function(req, res) {
    const result = await userServ.getUserDisks(req.user.username);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/**
 * @api {post} /user/disks/code  07.通过code换取access_token
 * @apiName 用户通过code换取access_token和refresh_token
 * @apiGroup 用户模块
 *
 * @apiParam {String} code 百度回调url code.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.post('/disks/code', reqHandler(async function(req, res) {
    const {code} = req.query;
    const result = await userServ.bindDisk(req.user.username, code);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/**
 * @api {delete} /user/disks/:id  08.用户解绑网盘
 * @apiName 用户解绑网盘
 * @apiGroup 用户模块
 *
 * @apiParam {String} code 百度回调url code.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.delete('/disks/:id', reqHandler(async function(req, res) {
    const {id} = req.params;
    const result = await userServ.deleteDisk(req.user.username, id);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

module.exports = router;
