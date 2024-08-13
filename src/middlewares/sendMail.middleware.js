import nodemailer from 'nodemailer';

const sendEmail = async(email, otp) => {

    // create an email transporter

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });

    // Configure email content

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Your verification OTP',
        text: `To verify your account, please use this otp: ${otp}`
    }

    // send email

    try{
        const result = await transporter.sendMail(mailOptions);
        console.log("Email send successfully");
        // console.log(result);
    }catch(err) {
        console.log("Email sending failed " + err);
    }

}

export default sendEmail;