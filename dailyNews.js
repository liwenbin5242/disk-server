const axios = require('axios');
const cheerio = require('cheerio');

async function getDailyNew() {
    const {data} = await axios.get('https://daily.zhihu.com/');
    const doc = cheerio.load(data);
    let a = [];
    doc('.box').each((index, element) => {
        a.push({
            id: index,
            title: element
        });
    });
}

getDailyNew();