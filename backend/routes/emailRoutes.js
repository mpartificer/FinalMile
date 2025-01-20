const express = require('express');
const router = express.Router();
const { sendConfirmationEmail } = require('../controllers/emailController');

router.post('/api/send-confirmation-email', sendConfirmationEmail);

module.exports = router;