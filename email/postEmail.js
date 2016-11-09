/**
 * Created by Administrator on 2016/11/8.
 */
var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');

function sendMail(toUser, subject, body){
    var userPath =path.dirname( __dirname) + '/user.txt';
    fs.readFile(userPath, 'utf8', function(err, data){
        data = JSON.parse(data);
        var transporter = nodemailer.createTransport({
            service: 'qq',
            auth: {
                user: data.user,
                pass: data.pass
            }
        });
        var mailOptions = {
            from: data.user, // sender address
            to: toUser, // list of receivers
            subject: subject, // Subject line
            html: body // html body
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
    })
}

exports = module.exports = sendMail;