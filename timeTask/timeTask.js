/**
 * Created by Administrator on 2016/11/2.
 */
//只支持linux平台，后面会按照另一种思路来进行解决
'use strict';
const exec = require('child_process').exec;
var dateParse = require('./dateParse');
var TIMEOUT_MAX = 2147483647; // 2^31-1

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

function nextTime(dateTime){
    var nowDate = new Date();
    var fireDate = new dateParse(nowDate.getTime());
    while(true){
        if(dateTime.year!=null && dateTime.year < fireDate.getFullYear()){
            fireDate = null;
            break
        }
        if(dateTime.year != null &&!judgeEqual(dateTime.year, fireDate.getFullYear())){
            fireDate.addYear();
            fireDate.setMonth(0);
            fireDate.setDate(1);
            fireDate.setHours(0);
            fireDate.setMinutes(0);
            fireDate.setSeconds(0);
            continue;
        }
        if(dateTime.year != null &&!judgeEqual(dateTime.month, fireDate.getMonth())){
            fireDate.addMonth();
            continue;
        }
        if(dateTime.day != null &&!judgeEqual(dateTime.day, fireDate.getDate())){
            fireDate.addDay();
            continue;
        }
        if(dateTime.hour != null &&!judgeEqual(dateTime.hour, fireDate.getHours())){
            fireDate.addHours();
            continue;
        }
        if(dateTime.minute != null &&!judgeEqual(dateTime.minute, fireDate.getMinutes())){
            fireDate.addMinutes();
            continue;
        }
        if(dateTime.second != null &&!judgeEqual(dateTime.second, fireDate.getSeconds())){
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
    var name = (arguments.length==3 && typeof arguments[0] === 'string')? arguments[0]:null;
    var date = name? arguments[1]:arguments[0];
    var callback = name? arguments[2]:arguments[1];
    if(typeof date === 'object'){
        var now = new Date();
        var year = date.year?date.year:null;
        var month = date.month?date.month:null;
        var day = date.day?date.day: null;
        var hours = date.hour?date.hour: null;
        var minutes = date.minute?date.minute: null;
        var seconds = date.second?date.second: null;
        var dateTime = new dateFunction(year,month,day,hours,minutes,seconds);
        var taskTime = nextTime(dateTime);
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
            currentArray = new Task(callback, name, nextTime(dateTime), null);
            taskArray.push(currentArray);
            taskArray.sort(function(a, b){
                return a.fireDate.getTime() - b.fireDate.getTime();
            });
            timerTask(date, currentArray.task)
        }, currentArray.fireDate.getTime()-now.getTime());
        return currentArray.timerId;
    }else{
        console.log('bad date type');
    }
}
timerTask({hour:10,second: 50}, function(){
    console.log('231231');
})

exports = module.exports = timeTask;