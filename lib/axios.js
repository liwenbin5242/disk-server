const axios = require('axios');
const config = require('config');
const baseurl = config.get('host');
const redis = require('../utils/rediser');

class ChatyServ {
    constructor() {
    }
    async request() {
        const Authorization = await redis.get('Authorization');
        const instance = axios.create();
        const config = {
            baseURL: baseurl,
            timeout: 3000,
            headers: {
                Authorization
            }
        };
        return instance(config);
    }
}

module.exports = new ChatyServ();