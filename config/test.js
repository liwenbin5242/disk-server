module.exports = {
    app: {
        name: 'wechat2tieba',
        port: 3000,
        url: 'http://81.70.203.247:3000',
        env: 'test'
    },
    host: 'http://39.106.205.87:7415',
    PORT: '3000',
    account: '15810185602',
    password: '123456',
    MONGODBS: {
        wechat: 'mongodb://15810185602:lilaoshuan123@81.70.203.247:7001/wechat'
    },
    REDIS: {
        'port': 8001,
        'host': '81.70.203.247',
        'db': 1,
        'password': 'lilaoshuan123'
    },
    GROUP_NAME: 'knowledgeGroup',
    ROOM_NAME: '冲冲冲'
};