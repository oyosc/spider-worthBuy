/**
 * Created by chenlei on 2016/11/20.
 */
// $('.btn-primary').click(function(){
//     alert('11');
// });

$(document).ready(function(){
    $('.btnGet').click(function(){
        var selectValue = $(".divGet").find("select").val();
        $.ajax({
            url: "/getArticleInfo",
            type: "post",
            data: {
                category: selectValue
            },
            dataType:'json',
            timeout:5000,
            success: function(datas){
                if(datas){
                    for(var i =0;i<datas.length;i++){
                        $('.divEmail').after("<a href='"+ datas[i].articleHref +"'>"+ datas[i].name+"</a></br>");
                    }
                }
            }
        });
    });
    
    $('.btnEmail').click(function(){
        var category = $(".divEmail").find("select").val();
        var name = $(".name").val();
        var email = $(".email").val();
        var time = $(".time").val();
        if(!name||!email||!time||!category){
           return alert("输入的参数不能为空");
        }
        $.ajax({
            url: "/timePushing",
            type: "post",
            data: {
                category: category,
                name: name,
                email: email,
                time: time
            },
            dataType:'json',
            timeout:5000,
            success: function(datas){
                alert(JSON.stringify(datas));
                if(datas.status){
                    $('.divEmail').after("<p>"+ datas.status +"</p>");
                }
                else{
                    for(var i =0;i<datas.length;i++){
                        $('.divEmail').after("<a href='"+ datas[i].articleHref +"'>"+ datas[i].name+"</a></br>");
                    }
                }
        }
        });
    });
});