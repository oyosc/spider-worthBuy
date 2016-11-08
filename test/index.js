/**
 * Created by Administrator on 2016/11/8.
 */
var lib = require('../service/spider');
var init = require('../init');

describe('spider', function(){
    it('spider', function(done){
        this.timeout(150000);
        init();
        lib('http://haitao.smzdm.com/xuan/s0f163t0p1/', '电脑数码', function(err, result){
            if(err){
                console.log(err);
            }
            if(result){
                console.log(result);
            }
            done();
        });
    });
})