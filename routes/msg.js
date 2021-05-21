const express = require('express');
const router = express.Router();

const {reqHandler} = require('../utils/reqHandler');
const msgServ = require('../modules/msg');

router.post('/yun', reqHandler(async function(req, res) {
    await msgServ.getMsg(req.body); 
    res.json({code: 0, msg: 'ok', data: {}});
}));

module.exports = router;
