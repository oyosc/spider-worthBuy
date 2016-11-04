/**
 * Created by Administrator on 2016/11/2.
 */
//只支持linux平台，后面会按照另一种思路来进行解决
'use strict';
const exec = require('child_process').exec;
var dateParse = require('./dateParse');

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

function timerTask(){
    var name = (arguments.length==3 && typeof arguments[0] === 'string')? arguments[0]:null;
    var date = name? arguments[1]:arguments[0];
    var callback = name? arguments[2]:arguments[1];
    if(typeof date === 'object'){
        var now = new Date();
        var year = date.year?date.year:null;
        var month = date.month?date.month:null;
        var day = date.day?date.day: null;
        var hours = date.hours?date.hours: null;
        var minutes = date.minutes?date.minutes: null;
        var seconds = date.seconds?date.seconds: null;
        var dateTime = new dateFunction(year,month,day,hours,minutes,seconds);
        var nowDate = new Date();
        var fireDate = new dateParse(nowDate.getTime());
        while(true){
            if(!judgeEqual(dateTime.year, fireDate.getFullYear())){
                fireDate.addYear();
                fireDate.setMonth(0);
                fireDate.setDate(1);
                fireDate.setHours(0);
                fireDate.setMinutes(0);
                fireDate.setSeconds(0);
                continue;
            }
            if(!judgeEqual(dateTime.month, fireDate.getMonth())){
                fireDate.addMonth();
                continue;
            }
            if(!judgeEqual(dateTime.day, fireDate.getDate())){
                fireDate.addDay();
                continue;
            }
            if(!judgeEqual(dateTime.hour, fireDate.getHours())){
                fireDate.addHours();
                continue;
            }
            if(!judgeEqual(dateTime.minute, fireDate.getMinutes())){
                fireDate.addMinutes();
                continue;
            }
            if(!judgeEqual(dateTime.second, fireDate.getSeconds())){
                fireDate.addSeconds();
                continue;
            }
            break;
        }
        console.log(fireDate);
        
    }else{
        console.log('bad date type');
    }
}
timerTask({hours: 8})

exports = module.exports = timeTask;