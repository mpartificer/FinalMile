const express = require('express');
const router = express.Router();
const { notifyOverflowCompanies } = require('../controllers/notificationController');

router.post('/notify-overflow-companies', notifyOverflowCompanies);

module.exports = router;
