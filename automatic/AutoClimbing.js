/**
 * Created by Administrator on 2016/10/31.
 */
var schedule = require('node-schedule');
var autoSpider = require('../service/autoSpider');


function autoClimbing(isAuto){
    schedule.scheduleJob({hour: 10, minute: 00}, function(){
        autoSpider(isAuto, function(err, result){
            if(err){
                console.log('----------------Error------------------');
                console.log('autoClimbing failed');
            }
            else if(result.status === "notCorrect"){
                console.log('----------------Warning------------------');
                console.log('autoClimbing not open');
            }
            else if(result){
                console.log('autoClimbing success');
            }
        })
    });
    
}

exports = module.exports = autoClimbing;
