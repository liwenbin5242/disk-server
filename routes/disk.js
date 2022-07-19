'use strict';
const express = require('express');
const router = express.Router();
const diskServ = require('../modules/disk');
const returnCode = require('../utils/returnCodes');
const { reqHandler } = require('../utils/reqHandler');

/**
 * @api {get} /disk/list 01.网盘文件列表
 * @apiName 根据网盘id获取网盘文件列表
 * @apiGroup 网盘模块
 *
 * @apiParam {String} id 网盘id.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.get('/filelist', reqHandler(async function(req, res) {
    const {id = '', order = 'name', dir = '/', web = 'web', folder = 0, showempty = 1} = req.query;
    const result = await diskServ.getDisklist(req.user.username, id, dir, order, web, folder, showempty);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/**
 * @api {get} /disk/disklist 02.获取网盘递归文件列表
 * @apiName 获取网盘递归文件列表
 * @apiGroup 网盘模块
 *
 * @apiParam {String} path 路径.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.get('/disklistall', reqHandler(async function(req, res) {
    const path = req.query.path || '/';
    const result = await diskServ.getDisklistall(req.user.username, path);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/**
 * @api {get} /disk/file 03.查询文件详细信息
 * @apiName 查询文件详细信息
 * @apiGroup 网盘模块
 *
 * @apiParam {String} fsids 文件id.
 * @apiParam {String} id 网盘id.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} msg 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.get('/file', reqHandler(async function(req, res) {
    const fsids = req.query.fsids ; 
    const id = req.query.id ; 
    const result = await diskServ.getFiles(req.user.username, id, fsids);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * @api {get} /disk/search 04.搜索文件
 * @apiName 搜索文件
 * @apiGroup 网盘模块
 *
 * @apiParam {String} key 搜索关键字.
 * @apiParam {String} dir 目录.
 * @apiParam {String} id 网盘id.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} msg 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
 router.get('/search', reqHandler(async function(req, res) {
    const {id, key, dir='/'} = req.query ; 
    const result = await diskServ.getDiskSearch(req.user.username, id, key, dir);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * @api {post} /disk/file 05.管理文件 移删改查
 * @apiName 管理文件
 * @apiGroup 网盘模块
 *
 * @apiParam {String} opera copy move rename .
 * @apiParam {Array} filelist [].
 * @apiParam {String} id 网盘id.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} msg 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
 router.post('/file', reqHandler(async function(req, res) {
    const {id, opera, filelist= []} = req.body ; 
    const result = await diskServ.fileManage(req.user.username, id, opera, filelist);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

/**
 * @api {post} /disk/cookie 06.新增cookie
 * @apiName 网盘绑定cookie
 * @apiGroup 网盘模块
 *
 * @apiParam {String} cookie string.
 * @apiParam {String} id 网盘id.
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} msg 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
 router.post('/cookie', reqHandler(async function(req, res) {
    const {id, cookie,} = req.body ; 
    const result = await diskServ.addCookie(req.user.username, id, cookie);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

module.exports = router;
