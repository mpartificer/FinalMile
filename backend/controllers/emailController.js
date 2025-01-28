const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendConfirmationEmail = async (req, res) => {
  const { to, deliveryId, contactName, authCode } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'New Shipment Created - FinalMile Delivery',
    html: `
      <h1>Hello ${contactName}!</h1>
      <p>Your new shipment has been created successfully.</p>
      <p>Your secure authentication code is: <strong>${authCode}</strong></p>
      <p>This code will expire in 24 hours.</p>
      <p>You can view and track your delivery at:</p>
      <p><a href="http://localhost:5173/FinalMile/Delivery/${deliveryId}/BidsView">http://localhost:5173/FinalMile/Delivery/${deliveryId}/BidsView</a></p>
      <p>You will need to enter your authentication code to access the delivery details.</p>
      <p>Thank you for choosing our service!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
};

module.exports = {
  sendConfirmationEmail
};