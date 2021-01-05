const express = require('express');
const router = express.Router();

const {reqHandler} = require('../utils/reqHandler');
const barServ = require('../modules/bar');
// 抢楼
router.get('/rob', reqHandler(async function(req, res) {
    const result = await barServ.getSofa();
    res.end(result);
}));

// 发帖 标题
router.get('/title', reqHandler(async function(req, res) {
    const result = await barServ.getTitle();
    res.end(result);
}));

// 发帖 内容
router.get('/content', reqHandler(async function(req, res) {
    const result = await barServ.getText();
    res.end(result);
}));
module.exports = router;
