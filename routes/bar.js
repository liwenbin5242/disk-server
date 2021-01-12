const express = require('express');
const router = express.Router();

const {reqHandler} = require('../utils/reqHandler');
const barServ = require('../modules/bar');

router.get('/rob', reqHandler(async function(req, res) {
    const result = await barServ.getSofa();
    res.end(result);
}));

router.get('/title', reqHandler(async function(req, res) {
    const result = await barServ.getTitle();
    res.end(result);
}));

router.get('/content', reqHandler(async function(req, res) {
    const result = await barServ.getText();
    res.end(result);
}));
module.exports = router;
