// backend/controllers/bidController.js
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendBidSelection = async (req, res) => {
    console.log(import.meta.env.TWILIO_ACCOUNT_SID)
    console.log(import.meta.env.TWILIO_AUTH_TOKEN)
    console.log(import.meta.env.TWILIO_PHONE_NUMBER)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { phoneNumber, shipmentId, shipmentCompany, bidderName } = req.body;
    
    console.log('Received request with data:', { phoneNumber, shipmentId, shipmentCompany, bidderName });
    
    // Verify Twilio credentials are present
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Missing Twilio credentials');
    }

    // Send message to selected bidder
    const message = await client.messages.create({
      body: `Congratulations ${bidderName}! You have been selected for shipment #${shipmentId} from ${shipmentCompany}. Please contact them at [SHIPPER_CONTACT_INFO] to coordinate delivery details.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log('Twilio message sent successfully:', message.sid);
    res.status(200).json({ message: 'Selection notification sent successfully' });
  } catch (error) {
    console.error('Detailed error in sendBidSelection:', error);
    res.status(500).json({ 
      message: 'Error sending selection notification', 
      error: error.message 
    });
  }
};

module.exports = {
  sendBidSelection
};