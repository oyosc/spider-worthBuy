/**
 * Created by Administrator on 2016/10/29.
 */
var dbName = {};
var handle = require('./handle');

var prepare = function(modelName){
    if(dbName[modelName] === null || dbName[modelName] === undefined){
        dbName[modelName] = handle.dbs[modelName];
    }
    return dbName[modelName];
}
prepare.init = function(config){
    var db = require('./sequelize')(config);
    handle.setDB(db);
}
exports = module.exports = prepare;