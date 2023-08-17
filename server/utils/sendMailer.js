const nodemailer = require("nodemailer");

// Function send mail
const sendMail = (email, promotioncode, packages, discountmessage) => {
  let transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.NODE_USEREMAIL,
      pass: process.env.NODE_PASSEMAIL,
    },
  });

  let message = {
    from: `"Project" <${process.env.NODE_USEREMAIL}>`,
    to: email,
    subject: "Successfully registered",
    html: `<p><strong>เรียน ท่านสมาชิก</strong></p><br>
                <p>โค้ดส่วนลดของคุณคือ ${promotioncode}</p>
                <p>${discountmessage}</p>
                <p>${packages}</p><br>
                `,
  };

  transporter
    .sendMail(message)
    .then((info) => {
      console.log("Email sented", info.response);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

module.exports = sendMail;
