const { decodeJwt } = require('./utils')
const { pathToRegexp} = require('path-to-regexp')
const url = require('url')
const whiteListUrls = [
    '/user/login',
    '/user/register',
]

function isWhiteListUrls(req) {
    const path = url.parse(req.url).pathname;
    for(let url of whiteListUrls) {
        if (pathToRegexp(url).exec(path)) {
            return true
        }
    }
}

async function tokenAuth(req, res, next) {
    try {
        req.headers.authorization = req.headers.authorization || 'Bearer ' + req.query.token;
        if(req.headers.authorization && !isWhiteListUrls(req)) {
            const result = await decodeJwt(req.headers.authorization.slice(7))
            req.user = result
            return next()
        } else if(isWhiteListUrls(req)) {
            return next()
        }
        return res.json({code: 1000, msg:'非法用户', data: {}})

    } catch (err) {
        return res.json({code: 1000, msg:'非法用户', data: {}})
    }
}
module.exports = {
    tokenAuth
}