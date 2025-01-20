const express = require('express');
const router = express.Router();
const { notifyOverflowCompanies } = require('../controllers/notificationController');

console.log('Setting up notification routes');

router.post('/notify-overflow-companies', (req, res) => {
    console.log('Route hit: /notify-overflow-companies');
    notifyOverflowCompanies(req, res);
});
module.exports = router;
