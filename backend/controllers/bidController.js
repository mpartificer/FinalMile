// backend/controllers/bidController.js
const twilio = require('twilio');
const nodemailer = require('nodemailer');

const sendNotifications = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      phoneNumber, 
      shipmentId, 
      shipmentCompany, 
      bidderName, 
      companyPhoneNumber,
      shipperEmail,
      bidAmount,
      bidderEmail,
      deliveryDetails
    } = req.body;
    
    // Send SMS notification (existing Twilio logic)
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Missing Twilio credentials in backend environment');
    }

    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await twilioClient.messages.create({
      body: `Congratulations ${bidderName}! You have been selected for shipment #${shipmentId} from ${shipmentCompany}. Please contact them at ${companyPhoneNumber} to coordinate delivery details.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    // Configure email transport
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Missing email credentials in backend environment');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Or configure your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Send email to shipment creator
    const emailContent = {
      from: process.env.EMAIL_USER,
      to: shipperEmail,
      subject: `Bid Selected for Shipment #${shipmentId}`,
      html: `
        <h2>Bid Selection Confirmation</h2>
        <p>This email confirms that you have selected a bid for your shipment #${shipmentId}.</p>
        
        <h3>Selected Bid Details:</h3>
        <ul>
          <li>Overflow Company: ${bidderName}</li>
          <li>Contact Phone: ${phoneNumber}</li>
          <li>Bid Amount: $${bidAmount}</li>
        </ul>

        <h3>Delivery Details:</h3>
        <p>${deliveryDetails}</p>

        <p>The selected company has been notified and will be in contact to coordinate the delivery.</p>
        
        <p>Thank you for using our platform!</p>
      `
    };

    await transporter.sendMail(emailContent);

    console.log('Notifications sent successfully');
    res.status(200).json({ 
      message: 'Selection notifications sent successfully',
      twilioMessageId: message.sid
    });
  } catch (error) {
    console.error('Detailed error in sendNotifications:', error);
    res.status(500).json({ 
      message: 'Error sending notifications', 
      error: error.message 
    });
  }
};

module.exports = {
  sendNotifications
};