const express = require('express');
const router = express.Router();

const {reqHandler} = require('../utils/reqHandler');
const chromiunServ = require('../modules/chromium');

router.get('/img', reqHandler(async function(req, res) {
    const url = req.query.url;
    const result = await chromiunServ.getImgs(url);
    res.json({code: 0, msg: 'ok', data: result});
}));

module.exports = router;
