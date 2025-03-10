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
      <p>Your secure access code is: <strong>${authCode}</strong></p>
      <p>This code will expire in 24 hours.</p>
      <p>You can view and track your delivery at:</p>
      <p><a href="https://finalmile.pages.dev/FinalMile/Delivery/${deliveryId}/BidsView">https://finalmile.pages.dev/FinalMile/Delivery/${deliveryId}/BidsView</a></p>
      <p>You will need to enter your access code to access the delivery details.</p>
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

const sendBidNotificationEmail = async (req, res) => {
  const { to, shipmentId, bidAmount, bidderName, bidderCompany, bidderPhone } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'New Bid Received - FinalMile Delivery',
    html: `
      <h1>New Bid Notification</h1>
      <p>You have received a new bid for your shipment #${shipmentId}.</p>
      <h2>Bid Details:</h2>
      <ul>
        <li>Bid Amount: $${bidAmount}</li>
        <li>Bidder Name: ${bidderName}</li>
        <li>Bidder Company: ${bidderCompany}</li>
        <li>Contact Phone: ${bidderPhone}</li>
      </ul>
      <p>You can view all bids for this shipment at:</p>
      <p><a href="https://finalmile.pages.dev/FinalMile/Delivery/${shipmentId}/BidsView">https://finalmile.pages.dev/FinalMile/Delivery/${shipmentId}/BidsView</a></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Bid notification email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send bid notification email' });
  }
};

module.exports = {
  sendConfirmationEmail,
  sendBidNotificationEmail
};