const argon2 = require('argon2');
const { EncryptJWT } = require('jose/jwt/encrypt');
// const { jwtDecrypt } = require('jose/jwt/decrypt');
const config = require('config');
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
async function decodeJwt(jwt) {
    // const { payload, } = await jwtDecrypt(jwt, config.get('privateKey'), {
      
    // });
    return payload;
}

/**
 * jwt签名
 */
async function encodeJwt(payload) {
    const jwt = await new EncryptJWT(payload)
        .setProtectedHeader({ alg: 'ES256' })
        .setExpirationTime('24h')
        .sign(config.get('privateKey'));

    console.log(jwt);
    return jwt;
}

module.exports = {
    argonVerification,
    argonEncryption,
    decodeJwt,
    encodeJwt
};