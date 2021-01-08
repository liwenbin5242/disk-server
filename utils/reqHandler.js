/**
 * 默认express错误处理包裹
 * @param {String} msg
 * @param {function} handler
 * @returns {function} callback
 */

const {logger} = require('./logger')
exports.reqHandler = function reqHandler(handler) {
    return async (req, resp, next) => {
        try {
            await handler(req, resp, next);
        } catch (err) {
            const errMsg = Object.assign(req.errMsg || {}, {
                logLevel: 'error',
                errStack: err.stack || err,
            });
            logger.error(err)
            return res.json(resJson(500, err.message || err || '内部错误', {}, errMsg));
        }
    };
};
