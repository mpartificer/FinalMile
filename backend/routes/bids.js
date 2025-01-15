// backend/routes/bids.js
const express = require('express');
const router = express.Router();
const { sendBidSelection } = require('../controllers/bidController');

console.log("we made it to the routes")

router.post('/send-bid-selection', sendBidSelection);

module.exports = router;