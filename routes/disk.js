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
router.get('/list', reqHandler(async function(req, res) {
    const {id = '', order = 'time', dir = '/', web = 'web', folder = 0, showempty = 1} = req.query;
    const result = await diskServ.getDisklist(req.user.username, id, dir, order, web, folder, showempty);
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));

/* */
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

/* */
/**
 * @api {get} /disk/file 02.查询文件信息
 * @apiName 查询文件信息
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

module.exports = router;
