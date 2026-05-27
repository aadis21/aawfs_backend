const express = require('express');
const router = express.Router();
const { applyMembership } = require('../controllers/membershipController');

router.post('/apply', applyMembership);

module.exports = router;
