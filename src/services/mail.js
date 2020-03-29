import nodemailer from 'nodemailer';


module.exports = {
	sendingMails : (mailparam, bankName) => {
		const transporter = nodemailer.createTransport({
            service: 'gmail',
			auth: {
				user: bankName === "sproutbg" ? "sproutbanksgroups@gmail.com" : "stashtrust@gmail.com",
				pass: bankName === "sproutbg" ? "sproutnewpassword" : "stashtrustnewpassword"
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
