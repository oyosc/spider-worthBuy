/**
 * Created by Administrator on 2016/10/29.
 */
var gulp = require('gulp');
var nodemon = require('nodemon');

gulp.task('init', function(cb){
    gulp.watch(["express.js", "views/*.jade", "service/*.js", "routes/**"],{readDelay: 30}, ["re_start"]);
    return cb();
});

gulp.task("re_start", function(cb){
    nodemon({
        script: './initStart.js',
        ext: 'js json'
    });
    nodemon.on('start', function(){
        console.log('server has started');
    });
    return cb();
});

gulp.task('default', ['re_start']);