// backend/controllers/notificationController.js
const twilio = require('twilio');
const { createClient } = require('@supabase/supabase-js');

// Debug log the environment variables (but hide sensitive parts)
console.log('Environment check:', {
  SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Not set',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'Set' : 'Not set',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Not set',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Not set',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? 'Set' : 'Not set'
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const notifyOverflowCompanies = async (req, res) => {
    console.log('Notification endpoint hit with body:', req.body);
    
    try {
      const { shipmentId } = req.body;
  
      if (!shipmentId) {
        console.log('Missing shipmentId in request');
        return res.status(400).json({ error: 'Shipment ID is required' });
      }
  
      console.log('Attempting to fetch companies from Supabase...');
      
      // Test Supabase connection
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('Overflow_Companies')
        .select('count');
      
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Supabase connection failed: ${testError.message}`);
      }
      
      console.log('Supabase connection successful');

      // Fetch overflow companies
      const { data: companies, error } = await supabase
        .from('Overflow_Companies')
        .select('phone_number');
  
      if (error) {
        console.error('Error fetching companies:', error);
        throw new Error(`Failed to fetch companies: ${error.message}`);
      }
  
      console.log(`Found ${companies?.length || 0} active companies`);

      if (!companies || companies.length === 0) {
        return res.json({ 
          success: true, 
          message: 'No active overflow companies found'
        });
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

      res.json({ 
        success: true, 
        message: `Notifications sent successfully to ${companies.length} companies` 
      });

    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        details: error.details || 'No additional details'
      });
      
      res.status(500).json({ 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
};

module.exports = {
  notifyOverflowCompanies
};