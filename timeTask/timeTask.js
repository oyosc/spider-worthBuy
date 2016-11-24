/**
 * Created by Administrator on 2016/11/2.
 */
//只支持linux平台，后面会按照另一种思路来进行解决
'use strict';
// const exec = require('child_process').exec;
var dateParse = require('./dateParse');
var TIMEOUT_MAX = 2147483647; // 2^31-1

// function timeTask(params, callback){
//     var startTime = ['*','*','*','*','*'];
//     var cronThing;
//     if(params.minute){
//         startTime[0] = params.minute;
//     }
//     if(params.hour){
//         startTime[1] = params.hour+1;
//     }
//     if(params.day){
//         startTime[2] = params.day;
//     }
//     if(params.month){
//         startTime[3] = params.month;
//     }
//     if(params.week){
//         startTime[4] = params.week;
//     }
//     cronThing = startTime.join(" ") + 'root' + params.order;
//     exec(cronThing, function(error, stdout, stderr){
//         if(error){
//             console.error('exec error: '+ error);
//             return;
//         }
//         console.log('stdout:'+ stdout)
//         console.log('stderr:' + stderr);
//     });
// }


//采用另一种思路的定时任务
function dateFunction(year, month, day, hours, minutes, seconds){
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hours;
    this.minute = minutes;
    this.second = seconds;
}

function Task(task, name, fireDate, timerId){
    this.name = name;
    this.task = task;
    this.fireDate = fireDate;
    this.timerId = timerId
}


var taskArray = [];

function judgeEqual(arg1, arg2){
    if(arg1 === null){
        return true;
    }
    if(typeof arg1 === 'number' && typeof arg2 ==='number'){
        return arg1 === arg2;
    }
    console.log('bad typeof date');
}

// function runAgainTask(task, fireDate){
//
// }

dateFunction.prototype.nextTime = function(dateTime){
    var nowDate = new Date();
    var fireDate = (dateTime instanceof Date)? new dateParse(dateTime.getTime()): new dateParse(nowDate.getTime());
    fireDate.addSeconds();
    while(true){
        if(dateTime.year!=null && dateTime.year < nowDate.getFullYear()){
            fireDate = null;
            break
        }
        if(dateTime.year != null &&!judgeEqual(this.year, fireDate.getFullYear())){
            fireDate.addYear();
            fireDate.setMonth(0);
            fireDate.setDate(1);
            fireDate.setHours(0);
            fireDate.setMinutes(0);
            fireDate.setSeconds(0);
            continue;
        }
        if(dateTime.month != null &&!judgeEqual(this.month, fireDate.getMonth())){
            fireDate.addMonth();
            continue;
        }
        if(dateTime.day != null &&!judgeEqual(this.day, fireDate.getDate())){
            fireDate.addDay();
            continue;
        }
        if(dateTime.hour != null &&!judgeEqual(this.hour, fireDate.getHours())){
            fireDate.addHours();
            continue;
        }
        if(dateTime.minute != null &&!judgeEqual(this.minute, fireDate.getMinutes())){
            fireDate.addMinutes();
            continue;
        }
        if(dateTime.second != null &&!judgeEqual(this.second, fireDate.getSeconds())){
            fireDate.addSeconds();
            continue;
        }
        break;
    }
    return fireDate;
}

function timeOut(callback, time){
    var timerId;
    if(time < TIMEOUT_MAX){
        timerId = setTimeout(callback, time);
        return timerId;
    }
    else{
        timerId = setTimeout(function(){
            time -= TIMEOUT_MAX;
            timeOut(callback, time);
        }, TIMEOUT_MAX)
        return timerId;
    }
}


function timerTask(){
    var name = (arguments.length==4 && typeof arguments[0] === 'string')? arguments[0]:null;
    var date = name? arguments[1]:arguments[0];
    var callback = name? arguments[2]:arguments[1];
    var nextTime = name? arguments[3]:arguments[2];
    if(typeof date === 'object'){
        var now = new Date();
        var year = date.year?date.year:null;
        var month = date.month?date.month:null;
        var day = date.day?date.day: null;
        var hours = date.hour?date.hour: null;
        var minutes = date.minute?date.minute: null;
        var seconds = date.second?date.second: 0;
        var dateTime = new dateFunction(year,month,day,hours,minutes,seconds);//15s
        if(nextTime){
            var taskTime = dateTime.nextTime(nextTime);
        }else{
            var taskTime = dateTime.nextTime(dateTime);
        }
        var task = new Task(callback, name, taskTime, null);
        taskArray.push(task);
        if(taskArray.length>1){
            taskArray.sort(function(a, b){
                return a.fireDate.getTime() - b.fireDate.getTime();
            });
        }
        var currentArray = taskArray[0];
        currentArray.timerId = timeOut(function(){
            if(currentArray.task){
                currentArray.task();
            }
            var cb = currentArray.task;
            taskArray.shift();
            timerTask(date, cb)
        }, currentArray.fireDate.getTime()-now.getTime());
        return currentArray.timerId;
    }else{
        console.log('bad date type');
    }
}

function cancelTask(timerId){
    for(var x=0;x<taskArray.length;x++){
        if(taskArray[x] == timerId){
            clearTimeout(timerId);
        }
    }
}

exports = module.exports = {
    timerTask: timerTask,
    cancalTask: cancelTask
};