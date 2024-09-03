import nodemailer from 'nodemailer';

export async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: "user69@gmail.com",
  //     pass: "password",
  //   },
  // });
  const transporter = nodemailer.createTransport({
    host: String(process.env.SMTP_SERVER_HOST),
    port: Number(process.env.SMTP_SERVER_PORT),
    secure: Boolean(process.env.SMTP_SERVER_SECURE), // true for 465, false for other ports
    auth: {
      user: String(process.env.SMTP_SERVER_USERNAME),
      pass: String(process.env.SMTP_SERVER_PASSWORD),
    },
  });

  await transporter.sendMail(mailOptions);
}