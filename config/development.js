module.exports = {
    app: {
        name: 'baidu-disk',
        port: 3101,
        url: 'http://81.70.203.247:3101',
        env: 'dev'
    },
    SECRET: 'baidudicksecret',
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
    jwtSimple: {
        secret: 'EmZuVAjWHdkztCrNDvkMlTVmZMomFmnh',
        encode: 'HS256'
    },
    privateKey: 'EmZuVAjWHdkztCrNDvkMlTVmZMomFmnh',
    CORS: [
        'http://localhost:9528'
    ]
};