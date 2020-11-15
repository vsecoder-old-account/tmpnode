var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var credit = require('./creditails.js');
function send (er, mail) {
	var transporter = nodemailer.createTransport(smtpTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		auth: {
			user: credit.mailfrom,
			pass: credit.mailpass,
		}
	}));

	var mailOptions = {
		from: 'Error loger <mailnodejs7@gmail.com>',
		to: mail,
		subject: '📢❗❗❗Error, please read❗❗❗',
		text: '❗❗❗ERROR❗❗❗',
        html: `
		<style>*{box-sizing: border-box;padding: 0;margin: 0;}/*💻Всеволод html*/</style>
		<div style="background: #d30d0e;width:100%;border-radius:10px;">
			<div style="width: 50%;float:left;background: #d30d0e;padding:10px;height: 400px;">
				<h1>🌐ERROR:</h1>
				<b style="color: #f7c104;">` + er + `</b>
			</div>
			<img style="max-width:100%;width: 50%;float:right;background: #d30d0e;height: 400px;" alt="💻Всеволод html" src="https://image.freepik.com/free-vector/window-operating-system-error-warning_100456-424.jpg">
		</div>
        `
	};

	transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		console.log(error);
        return false;
	} else {
        console.log('Email sent: ' + info.response);
        return true;
	}
	});
}
module.exports = send;