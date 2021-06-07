'use strict';
exports.MessageTypes = {
    0: '好友请求',
    1: '群相关通知消息',
    2: '群名片', 
    3: '个人名片',  
    4: '下线', 
    5: '私聊文本消息',  
    6: '私聊图片消息',
    7: '私聊视频消息',
    8: '私聊语音消息',
    9: '群聊文本消息',
    10: '群聊图片消息',
    11: '群聊视频消息',
    12: '群聊语音消息',
    13: '私聊其他类型消息',
    14: '群聊其他类型消息',
    15: '好友相关通知消息',
    16: '修改好友备注通知消息',
    17: '删除相关通知消息',
};

exports.MessageCodes = {
    FriendRequest: 0,
    RoomMsg: 1,
    3: 3,
    4: 4,
    PrivateChat: 5,
    6: 6,
    7: 7,
    8: 8,
    RoomTextMsg: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15, 
    16: 16,
    17: 17
};

exports.AutoReplyKeyWords = {
    Reply: '回复消息',
    Add: '添加好友',
};

exports.Rooms = {
    '信用卡还款提醒': '19112831499@chatroom',
    '冲冲冲': '20474388408@chatroom"'
};

exports.LabelConfig = {
    肉鸡: 1,
};

exports.FORCAST_ROOMS = [
    {id: '18628314657@chatroom', address: {province: '河南', city: '辉县'}}, // 家庭群
    // {id: '21676689835@chatroom', address: {province: '河南', city: '郑州'}}, // 名媛汇
    // {id: '20950390928@chatroom', address: {province: '河南', city: '郑州'}}, // myx
];