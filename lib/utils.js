const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('config');
const urlencode = require('urlencode')
/**
 * argon2加密字符串
 */
async function argonEncryption(text) {
    const argonOptions = {
        type: argon2.argon2id, // 加密模式：argon2i/argon2d/argon2id
    };
    const argon2Hash = await argon2.hash(text, argonOptions);
    return argon2Hash; // 加密字符串
}
/**
 * argon2验证字符串
 */
async function argonVerification(text, encryptedText) {
    const verify = await argon2.verify(encryptedText, text);

    return verify; // 是否相同 true/false
}

/**
 * jwt解析
 */
async function decodeJwt(token) {
    const data = await jwt.verify(token, config.get('privateKey'));
    return data;
}

/**
 * jwt签名
 */
async function encodeJwt(payload) {
    try {
        const token = jwt.sign(payload, config.get('privateKey'));
        return token
    } catch (err) {
        err
    }

}

async function urlecodes(req, res, next) {
    for (let i in req.query) {
        req.query[i] = await urlencode(req.query[i])
    }
    next()
}

module.exports = {
    argonVerification,
    argonEncryption,
    decodeJwt,
    encodeJwt,
    urlecodes
};