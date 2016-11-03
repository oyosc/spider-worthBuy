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

function dateFunction(year, month, day, hours, minutes, seconds){
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hours;
    this.minute = minutes;
    this.second = seconds;
}

function Task(task, name, fireDate){
    this.name = name;
    this.task = task;
    this.fireDate = fireDate
}

var taskArray = [];


// function runAgainTask(task, fireDate){
//
// }

function timerTask(){
    var name = (arguments.length==3 && typeof arguments[0] === 'string')? arguments[0]:null;
    var date = name? arguments[1]:arguments[0];
    var callback = name? arguments[2]:arguments[1];
    if(typeof date === 'object'){
        var now = new Date();
        console.log(now.getMonth());
        var year = date.year?date.year:now.getFullYear();
        var month = date.month?date.month:now.getMonth();
        var day = date.day?date.day: now.getDate();
        var hours = date.hours?date.hours: now.getHours()+1;
        var minutes = date.minutes?date.minutes: now.getMinutes();
        var seconds = date.seconds?date.seconds: now.getSeconds();
        var dateTime = new dateFunction(year,month,day,hours,minutes,seconds);
        if(dateTime.year<now.getFullYear()){
            return callback(null, {status: 'notCorrectYear'});
        }
        var fireDate = new Date();
        fireDate.setFullYear(dateTime.year);
        fireDate.setMonth(dateTime.month);
        fireDate.setDate(dateTime.day);
        fireDate.setHours(7);
        fireDate.setHours(8);
        fireDate.setHours(9);
        fireDate.setMinutes(0);
        fireDate.setSeconds(0);
        console.log(fireDate);
        // var task = new Task(callback, name, fireDate);
        // taskArray.push(task);
        // if(taskArray.length>1){
        //     taskArray.sort(function(a, b){
        //         return a.fireDate.getTime() - b.fireDate.getTime();
        //     })
        // }
        
        
        
        
        
        
    }else{
        console.log('bad date type');
    }
}
timerTask({hours: 8})
exports = module.exports = timeTask;