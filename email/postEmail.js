/**
 * Created by Administrator on 2016/11/8.
 */
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: '303451715@qq.com',
        pass: 'kwljpbmfekaccbae'
    }
})

var mailOptions = {
    from: '303451715@qq.com', // sender address
    to: 'chenlei@szzbmy.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});