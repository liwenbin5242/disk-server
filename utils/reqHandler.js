/**
 * 默认express错误处理包裹
 * @param {String} msg
 * @param {function} handler
 * @returns {function} callback
 */
exports.reqHandler = function reqHandler(handler) {
    return async (req, resp, next) => {
        try {
            await handler(req, resp, next);
        } catch (e) {
            next(e);
        }
    };
};