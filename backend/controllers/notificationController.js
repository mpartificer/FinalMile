const twilio = require('twilio');
const { createClient } = require('@supabase/supabase-js');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const notifyOverflowCompanies = async (req, res) => {
  try {
    const { shipmentId } = req.body;

    if (!shipmentId) {
      return res.status(400).json({ error: 'Shipment ID is required' });
    }

    // Fetch overflow companies from Supabase
    const { data: companies, error } = await supabase
      .from('Overflow_Companies')
      .select('phone_number')
      .eq('active', true);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch overflow companies' });
    }

    // Send SMS to each company
    const notificationPromises = companies.map(company => {
      const message = `New shipment available for bidding! View and bid here: http://localhost:5173/FinalMile/Delivery/${shipmentId}/Bidding`;
      
      return twilioClient.messages.create({
        body: message,
        to: company.phone_number,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    });

    await Promise.all(notificationPromises);

    res.json({ success: true, message: 'Notifications sent successfully' });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  notifyOverflowCompanies
};
