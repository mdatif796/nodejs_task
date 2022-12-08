require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports.sendEmail = async (email, link) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
             user: 'tempemail796@gmail.com',
             pass: process.env.EMAILPASS
            }
         });
    
         await transporter.sendMail({
            from: 'tempemail796@gmail.com',
            to: email,
            subject: 'Password Reset Link!',
            html: link
         }).then((err, mail) => {
            if(err){
                console.log(err);
            }
            console.log(mail);
         });
    } catch (error) {
        console.log(error);
    }
}
