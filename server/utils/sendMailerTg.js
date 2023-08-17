const nodemailer = require("nodemailer");

// Function send mail
const sendMailTg = (
  email,
  promotioncode,
  packages,
  discountmessage,
  telcontact,
  lineidcontact,
  emailcontact
) => {
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
    from: `"Discover the New You" <${process.env.NODE_USEREMAIL}>`,
    to: email,
    subject: "Successfully registered",
    html: `<p><strong>เรียน ผู้ลงทะเบียนรับสิทธิ์</strong></p><br>
                <p>โค้ดส่วนลดของคุณคือ ${promotioncode}</p>
                <p>${discountmessage}</p>
                <p>${packages}</p><br>
                <p>ท่านสามารถจองซื้อแพ็กเกจกับสถานประกอบการ (กรุณาจองล่วงหน้าอย่างน้อย 7 วัน)</p>
                <p>จอง/สอบถามข้อมูลเพิ่มเติมได้ที่</p>
                <p>โทร: ${telcontact} ${
      lineidcontact ? ` | Line ID: ${lineidcontact}` : ""
    }${emailcontact ? ` | Email: ${emailcontact}` : ""}</p>
                <p>${
                  packages ===
                  "เเพ็กเกจ Heavenly Splendid Recharge Getaway ที่ อีเดน บีช เขาหลัก รีสอร์ท แอนด์ สปา-อะ โลเปซาน คอลเลกชั่น โฮเทล ราคา 6,300 บาท"
                    ? "ใช้สิทธิ์ได้ภายในวันที่ 31 สิงหาคม 2566 เท่านั้น"
                    : "ใช้สิทธิ์ได้ภายในวันที่ 1 สิงหาคม - 31 ตุลาคม 2566"
                }</p>
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

module.exports = sendMailTg;
