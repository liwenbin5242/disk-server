const errCode = require('./errCodes')
/**
 * 默认express错误处理包裹
 * @param {String} msg
 * @param {function} handler
 * @returns {function} callback
 */

const {logger} = require('./logger');
exports.reqHandler = function reqHandler(handler) {
    return async (req, resp, next) => {
        try {
            await handler(req, resp, next);
        } catch (err) {
            const errMsg = Object.assign(req.errMsg || {}, {
                logLevel: 'error',
                errStack: err.stack || err,
            });
            logger.error(err);
            return resp.json({code: errCode[err.code] || errCode['INTERNAL_ERR'], msg: err.message, data:{}});
        }
    };
};
