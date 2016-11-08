/**
 * Created by Administrator on 2016/10/29.
 */
var express = require('./express');
var autoClimbing = require('./automatic/AutoClimbing');
var timeTask = require('./timeTask/timeTask');
var config = {
    database: 'spider',              //MYSQL数据库名
    username: "root",                   //MYSQL数据库用户
    password: "admin",               //MYSQL数据库密码
    options: {
        host : "localhost",              //MYSQL数据库地址
        logging : false,
        pool : {
            maxConnections : 300,
            minConnections : 0,
            maxIdleTime : 30 * 1000
        }
    },
    queue: true,
    maxConcurrentQueries: 150,
    modelPath: (require('path')).join(__dirname, 'model'),
    isAuto: true, //是否开启自动爬取
    climbingTime: "xxx"//暂时未开启
}

var init = function(){
    var mysql = require('./mysql_init/init');
    mysql.init(config);
    timeTask({minute: 13});
    // autoClimbing(config.isAuto);
    express;
}

exports = module.exports = init;