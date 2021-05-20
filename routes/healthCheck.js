const express = require('express');
const router = express.Router();

const {reqHandler} = require('../utils/reqHandler');

router.get('/', reqHandler(async function(req, res) {
    res.json({code: 0, msg: 'ok', data: {}});
}));
module.exports = router;
