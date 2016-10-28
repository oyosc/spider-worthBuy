/**
 * Created by Administrator on 2016/10/28.
 */
var express = require('express');
var app = express();

var request = require('request');
var cheerio = require('cheerio');

app.listen('3000', function(){
    console.log('hello world');
});

app.set('view engine', 'jade');
app.set('views', './views');


app.get('/', function(req, res){
    request('http://haitao.smzdm.com/', function(err, res1){
        if(err){
            console.log(err);
        }
        else if(res1.statusCode == 200){
            var result = res1.body.toString();
            var $ = cheerio.load(result,{decodeEntities: false});
            var result = null;
            var category = null,
                shop = null,
                article_tag = {},
                articleName = null,
                articleHref = null,
                articleDesc = null,
                article_unvotedwrap = null,
                article_imgurl = null,
                article_createTime = null,
                article_votedwrap = null;
            $('.feed-row-wide').each(function(idx, element){
                var $element = $(element);
                articleName = $element.find('.feed-block-title ').text().trim() + $element.find('.z-highlight').text().trim();
                article_imgurl = $element.find('.z-feed-img').find('img').attr('src');
                articleHref = $element.find('.z-feed-img').children('a').attr('href');
                category =
            });
            if(result != null){
                res.render('index', {message: result});
            }
            else{
                res.render('index', {message: 'GG'});
            }
        }
    });
})