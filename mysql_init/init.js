/**
 * Created by Administrator on 2016/10/29.
 */
var prepare = function(db){
    this.db = db;
    return this.db;
}
prepare.init = function(config){
    var db = require('./sequelize')(config);
    prepare(db);
    return;
}
exports = module.exports = prepare;