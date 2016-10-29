/**
 * Created by Administrator on 2016/10/29.
 */
var request = require('request');
var cheerio = require('cheerio');
var sequelize = require('../mysql_init/init');

var spider = function(url, category, callback){
    request(url, function(err, res1){
        if(err){
            console.log(err);
        }
        else if(res1.statusCode == 200){
            var result = res1.body.toString();
            var $ = cheerio.load(result,{decodeEntities: false});
            var result = null;
            var shop = null,
                article_tag = [],
                articleName = null,
                articleHref = null,
                articleDesc = null,
                article_unvotedwrap = null,
                article_imgurl = null,
                article_publishTime = null,
                article_votedwrap = null;
            $('.feed-row-wide').each(function(idx, element){
                var $element = $(element);
                articleName = $element.find('.feed-block-title ').text().trim() + $element.find('.z-highlight').text().trim();
                article_imgurl = $element.find('.z-feed-img').find('img').attr('src');
                articleHref = $element.find('.z-feed-img').children('a').attr('href');
                var timeAndShop = $element.find('.feed-block-extras').text().trim();
                var elementTag = $element.find('.feed-block-info').children('span').last().children('a');
                elementTag.each(function(idx1, tag){
                    article_tag.push($(tag).text().trim());
                })
                shop = timeAndShop.match(/\D+$/);
                article_publishTime = timeAndShop.substr(0, shop.index);
                articleDesc = $element.find('.feed-block-descripe').text().trim();
                article_unvotedwrap = $element.find('.feed-btn-group').find('.z-icon-zhi').next().text().trim();
                article_votedwrap = $element.find('.feed-btn-group').find('.z-icon-buzhi').next().text().trim();
                var nowTime = new Date();
                if(article_publishTime.indexOf('-') < 0){
                    var month = nowTime.getMonth()+1;
                    article_publishTime = month + '-' + nowTime.getDate() + ' ' + article_publishTime;
                }
            });
            return callback(null, articleDesc);
        }
    });
}

exports = module.exports = spider