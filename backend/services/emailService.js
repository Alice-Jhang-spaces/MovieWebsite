const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

const sendEmail = async (to, code) => {
    try {
        const mailOptions = {
            from: `"Info 6150 Project Team" <${process.env.EMAIL_USER}>`, 
            to, 
            subject: "Your Verification Code", 
            text: `Dear user,\n\nYour verification code is: ${code}\n\nThis code is valid for 15 minutes. Please do not share this code with anyone.\n\nThank you,\nVerification Team`, // 邮件内容 (纯文本)
            html: `<p>Dear user,</p>
                   <p>Your verification code is: <strong>${code}</strong></p>
                   <p>This code is valid for <strong>15 minutes</strong>. Please do not share this code with anyone.</p>
                   <p>Thank you,<br>Info 6150 Project Team</p>`, 
        };
        console.log(mailOptions);
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendEmail };