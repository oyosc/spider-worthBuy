/**
 * Created by Administrator on 2016/10/29.
 */
var request = require('request');
var cheerio = require('cheerio');
var sequelize = require('../mysql_init/init');
var async = require('async');

var spider = function(url, category, callback){
    request(url, function(err, res1){
        if(err){
            console.log(err);
        }
        else if(res1.statusCode == 200){
            var result = res1.body.toString();
            var $ = cheerio.load(result,{decodeEntities: false});
            var i = 0;
            async.whilst(
                function(){
                    return i < $('.feed-row-wide').length;
                },
                function(callback1){
                    i++;
                    var shop = null,
                        article_tag = [],
                        tag = {},
                        articleName = null,
                        articleHref = null,
                        articleDesc = null,
                        article_unvotedwrap = null,
                        article_imgurl = null,
                        article_publishTime = null,
                        article_votedwrap = null;
                    var $element = $($('.feed-row-wide')[i]);
                    articleName = $element.find('.feed-block-title ').text().trim() + $element.find('.z-highlight').text().trim();
                    article_imgurl = $element.find('.z-feed-img').find('img').attr('src');
                    articleHref = $element.find('.z-feed-img').children('a').attr('href');
                    var timeAndShop = $element.find('.feed-block-extras').text().trim();
                    var elementTag = $element.find('.feed-block-info').children('span').last().children('a');
                    elementTag.each(function(idx1, tag){
                        article_tag.push($(tag).text().trim());
                    });
                    tag = {article_tag: article_tag};
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
                    sequelize('article').findAll({
                        where: {name: articleName}
                    }).then(function(result){
                        if(result && result.length != 0){
                            return callback1(null, {status: 'isExistd'});
                        }
                        else{
                            return sequelize('category').findOne({
                                where: {name: category}
                                }).then(function(cateResult){

                                    var now = new Date();
                                    var month = now.getMonth() + 1;
                                    var time = now.getFullYear()+ '-'+month + '-' + now.getDate();
                                    if(cateResult && cateResult != null){
                                        sequelize('article').create({
                                            name: articleName,
                                            shop: shop[0],
                                            article_tag: JSON.stringify(tag),
                                            articleHref: articleHref,
                                            articleDesc: articleDesc,
                                            article_unvotedwrap: article_unvotedwrap,
                                            article_votedwrap: article_votedwrap,
                                            article_imgurl: article_imgurl,
                                            article_publishTime: article_publishTime,
                                            category_id: cateResult._id,
                                            create_time: time

                                        }).then(function(createResult){
                                            if(createResult && createResult!==null){
                                                return callback1(null, createResult);
                                            }
                                            else{
                                                return callback1(null, {status: 'createFailed'});
                                            }
                                        });

                                    }
                                    else{
                                        return callback1(null, {status: 'noCategory'});
                                    }
                                });
                            }
                        }).catch(function(err){
                            if(err){
                                return callback1(err, null);
                            }
                        });
                },
                function(err, result){
                    return callback(err, result);
                }
            );
        }
    });
}

var getArticleInfo = function(req, callback){
    var params = req.body;
    var articleName = params.name;
    var category = params.category;
    var time = params.publichTime;
    sequelize('article').findAll({
            where : {
                time : time,
                name: {"$like": "%"+articleName+"%"}
            },
            include: [
                {
                    model: sequelize('category'),
                    where: {name: category},
                    required: false
                }
            ]
        }
    ).then(function(result){
        if(result && result.length>0){
            if(result.category && result.category.length>0){
                return callback(null, result)
            }
        }
        else{
            return callback(null, {status: 'notRecord'});
        }
    })
    
}

exports = module.exports = spider;
exports.getArticleInfo = getArticleInfo;