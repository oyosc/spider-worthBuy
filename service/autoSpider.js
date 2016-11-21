/**
 * Created by Administrator on 2016/10/31.
 */
var spider = require('./spider');
var async = require('async');

var autoSpider = function(isAuto, callback){
    if(isAuto === true){
        var urlAndCategory = {};
        urlAndCategory = {
            电脑数码: "http://haitao.smzdm.com/xuan/s0f163t0p1/",
            服饰鞋包: "http://haitao.smzdm.com/xuan/s0f57t0p1/",
            运动户外: "http://haitao.smzdm.com/xuan/s0f191t0p1/",
            礼品钟表: "http://haitao.smzdm.com/xuan/s0f131t0p1/",
            个护化妆: "http://haitao.smzdm.com/xuan/s0f113t0p1/",
            家用电器: "http://haitao.smzdm.com/xuan/s0f27t0p1/",
            日用百货: "http://haitao.smzdm.com/xuan/s0f1515t0p1/",
            家居家装: "http://haitao.smzdm.com/xuan/s0f37t0p1/",
            图书音像: "http://haitao.smzdm.com/xuan/s0f7t0p1/"
        }
        function parallel(url, category){
            return function(callback1){
                spider(url, category, function(err, result){
                    if(err){
                        return callback1(err, null);
                    }
                    else{
                        return callback1(null, {status: 'success'});
                    }
                })
            }
        }
        var funcArray = [];
        Object.keys(urlAndCategory)
            .forEach(function(name){
                funcArray.push(parallel(urlAndCategory[name], name));
            });
        
        async.parallel(funcArray, function(err, results){
            if(err){
                return callback(err, null);
            }
            else if(results){
                return callback(null, {status: 'success'});
            }
        })
    }
    else{
        return callback(null, {status: "the auto spider is closed"});
    }
}

exports = module.exports = autoSpider;