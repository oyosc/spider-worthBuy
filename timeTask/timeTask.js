/**
 * Created by Administrator on 2016/11/2.
 */
//只支持linux平台，后面会按照另一种思路来进行解决
const exec = require('child_process').exec;
function timeTask(params, callback){
    var startTime = ['*','*','*','*','*'];
    var cronThing;
    if(params.minute){
        startTime[0] = params.minute;
    }
    if(params.hour){
        startTime[1] = params.hour+1;
    }
    if(params.day){
        startTime[2] = params.day;
    }
    if(params.month){
        startTime[3] = params.month;
    }
    if(params.week){
        startTime[4] = params.week;
    }
    cronThing = startTime.join(" ") + 'root' + params.order;
    exec(cronThing, function(error, stdout, stderr){
        if(error){
            console.error('exec error: '+ error);
            return;
        }
        console.log('stdout:'+ stdout)
        console.log('stderr:' + stderr);
    });
}

exports = module.exports = timeTask;