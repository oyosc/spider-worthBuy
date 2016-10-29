/**
 * Created by Administrator on 2016/10/29.
 */
var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    basename = path.basename(module.filename);

module.exports = function(config){
    var db = {}, modelPath = config.modelPath;
    var sequelize = new Sequelize(config.database, config.username, config.password, config.options);
    fs.readdirSync(modelPath)
        .filter(
            function(file){
                return (file.indexOf('.') !==0) && (file !== basename);
            }
        )
        .forEach(function(file){
            try{
                var model = sequelize.import(path.join(modelPath, file));
                db[model.name] = model;
            }catch(e){
                console.log(e);
            }
        })
    Object.keys(db)
        .forEach(function(modelName){
            if(db[modelName]['associate']){
                db[modelName].associate(db);
            }
        })
    if(config.type != "read"){
        sequelize.sync({force: false});
    }
    
    console.log("mysql init success");
    return db;
}
    