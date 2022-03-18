'use strict';

const mongodber = require('../utils/mongodber');
const diskDB = mongodber.use('disk');
const moment = require('moment');
const axios = require('axios');
const utils = require('../lib/utils');
const { ObjectId } = require('mongodb');
const { util } = require('config');

moment.locale('zh-cn');

/**
 * 获取菜单树
 * @param {账号} username
 */
async function getMenuTree() {
    const returnData = {};
    const list = await diskDB.collection('MenuTree').aggregate([{
        $project: {
            _id: 0, id: '$_id', 'parentId': 1,
            'name': 1,
            'authority': 1,
            'path': 1,
            'component': 1,
            'icon': 1,
            'sortNumber': 1,
            'menuType': 1,
            'hide': 1,
            'createTime': 1,
            'updateTime': 1
        }
    }]).toArray();
    return list
}


module.exports = {
    getMenuTree
};