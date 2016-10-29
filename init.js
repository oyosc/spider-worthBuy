/**
 * Created by Administrator on 2016/10/29.
 */
var express = require('./express');
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
    modelPath: (require('path')).join(__dirname, 'model')
}

var mysql = require('./mysql_init/init');
mysql.init(config);
express;