const nodemailer = require('nodemailer');

const sendEmail = async options =>{
 const transport  = {//access the configuration details saved in environment variable
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};//transport contains the configuration details

const transporter = nodemailer.createTransport(transport);
    //transporter - a nodemailer object that uses the configuration details in transport to send  emails

const message ={//these arguments are get from forgetPassword fn in authController
    from : `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to : options.email,
    subject : options.subject,
    text : options.message
}//send email along with this msg

await transporter.sendMail(message);
//sendMail message is a nodemailer method to send data to Mailtrap smtp server then email appears in mailtrap sandbox

}
module.exports = sendEmail;
    
 
