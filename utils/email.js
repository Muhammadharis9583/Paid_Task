const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.EMAILER_USERNAME,
      pass: process.env.EMAILER_PASSWORD,
    },
    // for Gmail => activate 'less secure app' option
  });

  // 2) Define the email options.
  const mailOptions = {
    from: 'Hammood Habibi <juan@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // 3) Send the Email.
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
