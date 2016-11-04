/**
 * Created by Administrator on 2016/11/4.
 */
var dateFunction = {
    addYear: function addYear(){
        this.setFullYear(this.getFullYear()+1);
        console.log(this.getFullYear());
    },
    addMonth: function addMonth(){
        this.setDate(1);
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMonth(this.getMonth()+1);
        console.log(this.getMonth());
    },
    addDay: function addDay(){
        var day = this.getDate();
        this.setDate(day + 1);
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
    },
    addHours: function addHours(){
        this.setHours(this.getHours()+1);
        this.setMinutes(0);
        this.setSeconds(0);
    },
    addMinutes: function addMinutes(){
        this.setMinutes(this.getMinutes()+1);
        this.setSeconds(0);
    },
    addSeconds: function addSeconds(){
        this.setSeconds(this.getSeconds()+1);
    }
}

function dateParse(timeStamp){
    var date = timeStamp? new Date(timeStamp) : new Date();
    var methods = Object.keys(dateFunction);
    for(var i=0; i<methods.length; i++){
        var method = methods[i];
        date[method] = dateFunction[method].bind(date);
    }
    return date;
}

exports = module.exports = dateParse