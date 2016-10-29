/**
 * Created by Administrator on 2016/10/28.
 */
var express = require('express');
var app = express();
var spider = require('./service/spider');
var bodyParser = require('body-parser');


app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}))

app.listen('3000', function(){
    console.log('hello world');
});

app.set('view engine', 'jade');
app.set('views', './views');


app.post('/spiderData', function(req, res){
    var params = req.body;
    var requestUrl = params.url;
    var category;
    switch(requestUrl){
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
    }
    spider(requestUrl, category, function(err, result){
        res.render('index', {message: result})
    })
})

module.exports = app;