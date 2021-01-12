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
            err.message = errMsg;
            logger.error(err);
            return resp.end('好像出错了呢，快看下吧');
        }
    };
};
