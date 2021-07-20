'use strict';
const express = require('express');
const router = express.Router();
const userServ = require('../modules/user');
const returnCode = require('../utils/returnCodes');
const { reqHandler } = require('../utils/reqHandler');

/* y用户登录获取token*/
router.post('/login', reqHandler(async function(req, res) {
    const {account, password} = req.body;
    const result = await userServ.postUserLogin(account, password);
    res.json({code: returnCode.SUCCESS, data: result, msg: ''});
}));

module.exports = router;
