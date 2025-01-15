import twilio from 'twilio'

const twilioClient = twilio(import.meta.env.VITE_TWILIO_ACCOUNT_SID, import.meta.env.VITE_TWILIO_AUTH_TOKEN);

export default twilioClient
