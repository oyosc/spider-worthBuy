/**
 * Created by Administrator on 2016/10/28.
 */
var express = require('express');
var app = express();
var spider = require('./service/spider');
var bodyParser = require('body-parser');
var Task = require('./timeTask/timeTask');
var path = require('path');


app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}))

app.listen('3000', function(){
    console.log('port: 3000');
});

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

function judge(url, category){
    if(url){
        var category;
        switch(url){
            case 'http://haitao.smzdm.com/xuan/s0f163t0p1/':
                category = "电脑数码";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f57t0p1/' :
                category = "服饰鞋包";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f191t0p1/' :
                category = "运动户外";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f131t0p1/':
                category = "礼品钟表";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f113t0p1/' :
                category = "个护化妆";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f27t0p1/':
                category = "家用电器";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f1515t0p1/' :
                category = "日用百货";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f37t0p1/' :
                category = "家居家装";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f7t0p1/':
                category = "图书音像";
                break;
            default:
                category = "isNull"
        }
        return category;
    }
    if(category){
        var requestUrl;
        switch(category){
            case '电脑数码':
                requestUrl = "http://haitao.smzdm.com/xuan/s0f163t0p1/";
                break;
            case '服饰鞋包' :
                requestUrl = "http://haitao.smzdm.com/xuan/s0f57t0p1/";
                break;
            case '运动户外' :
                requestUrl = "http://haitao.smzdm.com/xuan/s0f191t0p1/";
                break;
            case '礼品钟表':
                requestUrl = "http://haitao.smzdm.com/xuan/s0f131t0p1/";
                break;
            case '个护化妆' :
                requestUrl = "http://haitao.smzdm.com/xuan/s0f113t0p1/";
                break;
            case 'http://haitao.smzdm.com/xuan/s0f27t0p1/':
                requestUrl = "家用电器";
                break;
            case '日用百货' :
                requestUrl = "http://haitao.smzdm.com/xuan/s0f1515t0p1/";
                break;
            case '家居家装' :
                requestUrl = "http://haitao.smzdm.com/xuan/s0f37t0p1/";
                break;
            case '图书音像':
                requestUrl = "http://haitao.smzdm.com/xuan/s0f7t0p1/";
                break;
            default:
                requestUrl = "isNull";
        }
        return requestUrl;
    }
    
}

app.get('/', function(req, res){
    res.render('index', {message: "this is the spider-worthBuy"});
});

app.post('/spiderData', function(req, res){
    var params = req.body;
    var requestUrl = params.url;
    var category;
    category = judge(requestUrl, null);
    if(category === "isNull"){
        res.json('the category is not exist');
    }
    else{
        spider(requestUrl, category, function(err, result){
            res.json(result)
        })
    }
})

app.post('/getArticleInfo', function(req, res){
    var params = req.body;
    var category = params.category;
    var requestUrl;
    requestUrl = judge(null, category);
    spider.getArticleInfo(req, function(err, result){
        if(err){
            return callback(err, null);
        }
        if(result.status == 'notRecord'){
            spider(requestUrl, category, function(err1, result1){
                if(err1){
                    return res.json(err1);
                }
                else{
                    return res.json(result1);
                }
            })
        }
        else {
            res.json(result);
        }
    })
    
})

app.post('/timePushing', function(req, res){
    var params = req.body;
    var email = params.email;
    var category = params.category;
    var time = params.time;
    var articleName = params.name;
    spider.timePush(email, category, articleName, time, function(err, result){
        if(err){
            console.log(err);
        }
        if(result.status == 'notRecord'){
            var timerId = Task.timerTask({hour: 8}, function(){
                spider.timePush(email, category, articleName, time, function(err1, result1){
                    if(err1){
                        return res.json(err1);
                    }
                    else if(result1.status == 'notRecord'){
                        return res.json({status: 'also spider data'})
                    }
                    else{
                        Task.cancalTask(timerId);
                        return res.json({status: 'the data has sent to your email'});
                    }
                })
                })
        }
        else{
            return res.json({status: result});
        }
    })
});

module.exports = app;