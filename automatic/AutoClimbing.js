/**
 * Created by Administrator on 2016/10/31.
 */
var autoSpider = require('../service/autoSpider');
var autoClimbing = function(isAuto){
    var nowTime = new Date();
    var hours = nowTime.getHours();
    if(hours === 8){
        autoSpider(isAuto, function(err, result){
            if(err){
                console.log('----------------Error------------------');
                console.log('autoClimbing failed');
            }
            else if(result){
                console.log('autoClimbing success');
            }
        })
    }else{
        autoSpider(false, function(err, result){
            if(result.status === "notCorrect"){
                console.log('----------------Warning------------------');
                console.log('now autoClimbing not correct-time');
            }
        })
    }
}

exports = module.exports = autoClimbing;
