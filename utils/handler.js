function handler({data: {code, message, data}, config}) {
    if (code !== '1000'){
        throw new Error(code, config, message);
    }
    return data;
}

module.exports = {
    handler
};