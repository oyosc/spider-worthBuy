/**
 * Created by Administrator on 2016/10/29.
 */
var dbName = null;
var prepare = function(){
}
prepare.init = function(config, status){
    if(status){
        console.log('11');
        return dbName
    }
    else{
        var db = require('./sequelize')(config);
        dbName = db;
        return dbName
    }
}
exports = module.exports = prepare;