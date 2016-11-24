/**
 * Created by Administrator on 2016/10/29.
 */
var express = require('./express');
var timeTask = require('./timeTask/timeTask');
var autoSpider = require('./service/autoSpider.js');
var config = {
    database: 'spider',              //MYSQL数据库名
    username: "root",                   //MYSQL数据库用户
    password: "",               //MYSQL数据库密码
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
    timeTask.timerTask({minute: 30}, function(){
        return autoSpider(config.isAuto, function(err, result){
            var now = new Date();
            var nowTime = now.getFullYear() + "-" +(now.getMonth()+1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(); 
            console.log('start spider,spiderTime: '+ nowTime);
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
            }
        })
    });
    express;
}

exports = module.exports = init;