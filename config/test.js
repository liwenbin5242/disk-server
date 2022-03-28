module.exports = {
    app: {
        name: 'baidu-disk',
        port: 3101,
        url: 'http://81.70.203.247:3101',
        env: 'dev'
    },
    SECRET: 'baidudicksecret',
    MONGODBS: {
        admin: {
            host: 'mongodb://81.70.203.247:4567/admin',
            // user: 'liwenbin01', 超级管理员01
            // password: 'lilaoshuan!!!$$$'
            user: 'liwenbin',   // 超级管理员
            password: 'lilaoshuan!@#123'
        },
        wechat: {
            host: 'mongodb://81.70.203.247:4567/wechat',
            user: '15810185602',
            password: 'liwenbin($%@>($%#'
        },
        disk: {
            host: 'mongodb://81.70.203.247:4567/disk',
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
    privateKey: 'EmZuVAjWHdkztCrNDvkMlTVmZMomFmnh',
    CORS: [
        'http://localhost:9528'
    ],
    BaiDuDisk: {
        clientid: 'Xo5gDASeVZRxHArna5hviweIGkllqetf',
        clientsecret: 'GVpNxBBQ3P79GTcGWPfnds5jk7Um6EM8',
        signkey: 'n39*as6rSaWPj6s$9wNd4eGlUQOA1C1z',
        redirecturi: 'http://api.aassc.cn/oauth_redirect',
    }
};