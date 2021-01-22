const express = require('express');
const router = express.Router();
const fs = require('fs');
const {reqHandler} = require('../utils/reqHandler');
const msgServ = require('../modules/msg');

router.get('/yun', reqHandler(async function(req, res) {
    const result = await msgServ.getMsg(req.body);
    fs.writeFileSync(Date.now + '.txt', JSON.stringify(req.body));
    res.end(result);
}));

module.exports = router;
