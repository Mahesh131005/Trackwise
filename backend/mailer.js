const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBudgetAlert = async (email, category, percent, amount, budget) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `⚠️ Budget Alert: ${category} is at ${percent}%`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #d9534f;">Budget Alert for ${category}</h2>
          <p>You have used <strong>${percent}%</strong> of your budget for <strong>${category}</strong>.</p>
          <p>Spent: <strong>₹${amount}</strong> / ₹${budget}</p>
          <p>Please review your expenses to stay on track!</p>
          <br>
          <p>Best regards,</p>
          <p><strong>Trackwise Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Budget alert sent to ${email} for ${category}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

module.exports = { sendBudgetAlert };
