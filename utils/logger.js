const log4js = require('log4js');
const config = require('config');
const _ = require('lodash');

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: 'console'
        },
        {
            type: 'dateFile',
            filename: 'logs/baidu-disk.log',
            pattern: '_yyyy-MM-dd',
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        }
    ],
    replaceConsole: true,
    levels: {
        dateFileLog: 'info'
    }
});

const dateFileLog = log4js.getLogger(_.isEqual(config.get('app.env'), 'dev') ? 'console' : 'dateFileLog');

exports.logger = dateFileLog;
