module.exports = {
    app: {
        name: 'wechat2tieba',
        port: 3000,
        url: 'http://81.70.203.247:3000',
        env: 'production'
    },
    host: 'http://39.106.205.87:9899',
    PORT: '3000',
    account: '15810185602',
    password: '123456',
    MONGODBS: {
        wechat: {
            host: 'mongodb://81.70.203.247:7001/wechat',
            user: '15810185602',
            password: 'liwenbin($%@>($%#'
        }
    },
    REDIS: {
        'port': 8001,
        'host': '81.70.203.247',
        'db': 1,
        'password': 'liwenbin($%@>($%#'
    },
    GROUP_NAME: 'knowledgeGroup',
    ROOM_NAME: '冲冲冲',
    MY_NAME: '@A001',
    DEDAO_SERV: {
        url: 'http://81.70.203.247:4567',
    },
    FORCAST_ROOMS: [
        {id: '18628314657@chatroom', address: {province: '河南', city: '辉县'}}, // 家庭群
        {id: '21676689835@chatroom', address: {province: '河南', city: '郑州'}}, // 名媛汇
        {id: '20950390928@chatroom', address: {province: '河南', city: '郑州'}}, // myx
    ]
};