const nodeMailer = require('../config/nodemailer');


module.exports.passwordReset = async (email, link) => {
    await nodeMailer.transporter.sendMail({
        from: 'tempemail796@gmail.com',
        to: email,
        subject: 'Password Reset Link!',
        html: link
    });
}