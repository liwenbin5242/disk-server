'use strict';
const express = require('express');
const router = express.Router();
const menuServ = require('../modules/menu');
const returnCode = require('../utils/returnCodes');
const { reqHandler } = require('../utils/reqHandler');

/**
 * @api {get} /menu/tree 01.获取菜单树
 * @apiName 获取菜单树
 * @apiGroup 网盘模块
 *
 * @apiSuccess {String} code 响应码, 如： 200, 0，……
 * @apiSuccess {String} message 响应信息
 * @apiSuccess {Object} data 数据对象数组
 */
router.get('/tree', reqHandler(async function(req, res) {
    const result = await menuServ.getMenuTree();
    res.json({code: returnCode.SUCCESS, data: result, message: true});
}));


module.exports = router;
