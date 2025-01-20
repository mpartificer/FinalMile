const express = require('express');
const router = express.Router();
const { sendNotifications } = require('../controllers/bidController');

// Update the route to use the new combined notifications endpoint
router.post('/send-notifications', sendNotifications);

module.exports = router;


