import nodemailer from 'nodemailer';


export default {
	sendingMail: function(mailparam) {
		const transporter = nodemailer.createTransport({
            host: 'mail.google.com',
            port: 587,
            secure:false,
			auth: {
				user: "sproutbanksgroups@gmail.com",
				pass: "sproutnewpassword"
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
