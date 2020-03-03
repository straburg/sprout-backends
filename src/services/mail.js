import nodemailer from 'nodemailer';


export default {
	sendingMail: function(mailparam) {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "boritunmise@gmail.com",
				pass: "new password"
			}
		});
		return new Promise(function(resolve, reject) {
			transporter.sendMail(mailparam, function(error, sent) {
				if (sent) {
					resolve('sent successful');
				} else {
					reject(new Error('please try again'));
				}
			});
		});
	}
};
