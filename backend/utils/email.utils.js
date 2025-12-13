const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: `"PONION" <accounts@vijstack.com>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", data.id);
    return data;
  } catch (err) {
    console.error("Error sending email:", err);
    return null; // prevents app crash (same behavior as safe SMTP)
  }
};

module.exports = sendEmail;
