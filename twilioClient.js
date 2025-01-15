import twilio from 'twilio'

const twilioClient = twilio(import.meta.env.TWILIO_ACCOUNT_SID, import.meta.env.TWILIO_AUTH_TOKEN);

export default twilioClient
