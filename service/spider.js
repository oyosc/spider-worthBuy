/**
 * Created by Administrator on 2016/10/29.
 */
var request = require('request');
var cheerio = require('cheerio');
var sequelize = require('../mysql_init/init');
var async = require('async');
var postEmail = require('../email/postEmail');

var spider = function(url, category, callback){
    function requestUrl(limitUrl){
        var url = limitUrl;
        return function(cb){
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
                            if(!articleHref){
                                return callback1(null, 'null');
                            }
                            var timeAndShop = $element.find('.feed-block-extras').text().trim();
                            var elementTag = $element.find('.feed-block-info').children('span').last().children('a');
                            elementTag.each(function(idx1, tag){
                                article_tag.push($(tag).text().trim());
                            });
                            tag = {article_tag: article_tag};
                            if(timeAndShop.indexOf('6PM')>0){
                                shop = timeAndShop.match(/(6PM)$/);
                            }
                            else if(timeAndShop.indexOf('韩国11街')>0){
                                shop = timeAndShop.match(/(韩国11街)$/);
                            }
                            else{
                                shop = timeAndShop.match(/\D+$/);
                            }
                            if(!shop){
                                return callback1(null, "shop is not exist");
                            }
                            article_publishTime = timeAndShop.substr(0, shop.index);
                            var now = new Date();
                            var year = now.getFullYear();
                            article_publishTime = year + ' ' + article_publishTime;
                            articleDesc = $element.find('.feed-block-descripe').text().trim();
                            article_unvotedwrap = $element.find('.feed-btn-group').find('.z-icon-zhi').next().text().trim();
                            article_votedwrap = $element.find('.feed-btn-group').find('.z-icon-buzhi').next().text().trim();
                            var nowTime = new Date();
                            if(article_publishTime.indexOf('-') < 0){
                                var month = nowTime.getMonth()+1;
                                article_publishTime = month + '-' + nowTime.getDate() + ' ' + article_publishTime;
                            }
                            var timeEx = /^(\d{4}) (\d{2}-(\d){2}) (\d{2}:\d{2})$/
                            var otherTimeEx = /^(\d{2}-(\d){2}) (\d{4}) (\d{2}:\d{2})$/
                            if(!timeEx.test(article_publishTime)&&!otherTimeEx.test(article_publishTime)){
                                return callback1(null, "article_publishTime is not correct");
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
                            if(err){
                                return cb(err, null);
                            }
                            return cb(null, {status: "crawl success"});
                        }
                    );
                }
            });
        }
    }
    request(url, function(err, bodyResult){
        if(err){
            console.log(err);
        }
        else if(bodyResult.statusCode == 200){
            var allResult = bodyResult.body.toString();
            var $ = cheerio.load(allResult,{decodeEntities: false});
            var $element1 = $('.pagenation-list');
            var taskArray = [];
            var $li = $element1.children('li');
            for(var i =0; i< $li.length; i++){
                var $url = $($li[i]);
                var url = $url.children('a').attr('href');
                if(!url){
                    break;
                }
                taskArray.push(requestUrl(url));
            }
            async.series(taskArray, function(err, results){
                if(err){
                    return callback(err, null);
                }
                if(results){
                    return callback(null, "success");
                }
            })
            
        }
    })
}

var getArticleInfo = function(req, callback){
    var params = req.body;
    var articleName = params.name || null;
    var category = params.category;
    var time = params.publichTime || null;
    var where = {};
    if(articleName){
        where["name"] = {"like": "%"+articleName+"%"};
    }
    else if(time){
        where["article_publishTime"] = {gt: time};
    }
    
    sequelize('article').findAll({
            where : where,
            include: [
                {
                    model: sequelize('category'),
                    where: {name: category}
                }
            ]
        }
    ).then(function(result){
        if(result && result.length>0){
                return callback(null, result);
        }
        else{
            return callback(null, {status: 'notRecord'});
        }
    })
    
}

var timePush = function(email, category, articleName, time, callback){
    if(email&&category&&articleName&&time){
        getArticleInfo({
            body:{
                name: articleName,
                category: category,
                publichTime: time
            }
        }, function(err, result){
            if(err){
                return callback(err, null);
            }
            if(result.length>0){
                var sendData = [];
                // result = '<b>' + JSON.stringify(result) + '</b>';
                var subject = 'new article to you';
                for(var i =0; i < result.length; i++){
                    var text = {};
                    text["name"] = result[i].dataValues.name;
                    text["href"] = result[i].dataValues.articleHref;
                    sendData.push(text);
                }
                sendData = JSON.stringify(sendData);
                postEmail(email, subject, sendData);
                return callback(null, 'get your ask, please wait a minute, we will send message to your email');
            }
            else{
                return callback(null, {status: 'notRecord'});
            }
        })
    }
    else{
        return callback(null, {status: 'noCorrectParams'});
    }
}

exports = module.exports = spider;
exports.getArticleInfo = getArticleInfo;
exports.timePush = timePush;