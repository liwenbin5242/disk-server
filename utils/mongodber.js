/* eslint-disable no-console */
let { MongoClient } = require('mongodb');

/*
 * Mongodber class
 */
function Mongodber() {
    this.dbs = {};
}

Mongodber.prototype.init = async function (dbs_conf) {
    this.dbs_conf = dbs_conf;
    let promises = Object.keys(dbs_conf).map(name => (async () => {
        console.log(`init ${name}`);
        let db_url = dbs_conf[name];
        MongoClient = new MongoClient(db_url, {useUnifiedTopology: true});
        try {
            this.dbs[name] = await MongoClient.connect();
        } catch (e) {
            throw new Error(`Init ${name} failed: ${e.message}`);
        }
    })());
    await Promise.all(promises);
};

Mongodber.prototype.use = function (name) {
    return this.dbs[name].db(name);
};

module.exports = new Mongodber();
