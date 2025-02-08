const express = require('express');
const router = express.Router();
const { sendConfirmationEmail, sendBidNotificationEmail } = require('../controllers/emailController');

router.post('/api/send-confirmation-email', sendConfirmationEmail);
router.post('/api/send-bid-notification', sendBidNotificationEmail)

module.exports = router;