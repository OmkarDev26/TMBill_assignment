const nodemailer = require("nodemailer");

module.exports = function sendEmail(email, otp) {
  return new Promise(async (resolve, reject) => {
    try {
      //   let transporter = nodemailer.createTransport({
      //     service: "gmail",
      //     auth: {
      //       user: "business.omkar.devrukhkar@gmail.com",
      //       pass: "sjaiiqzrkxxuhhxv",
      //     },
      //     tls: {
      //       rejectUnauthorized: false,
      //     },
      //   });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "omkardevrukhkar0@gmail.com",
          pass: process.env.PASS,
        },
      });

      const output = `
                  <div style="font-family: Helvetica,Arial,sans-serif;">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <p>Hi,</p>
                <p>Use the following OTP to reset your password.</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
              </div>
            </div>`;

      let mailOptions = {
        to: email, // list of receivers
        subject: "Your OTP to reset your passsword", // Subject line
        html: output, // html body
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) reject(error);
        if (info) resolve("Mail Sent");
      });
    } catch (error) {
      reject(error);
    }
  });
};
