const express = require('express');
const router = express.Router();
const { performResearch } = require('../controllers/researchController');
const { protect } = require('../middleware/auth');

router.get('/', protect, performResearch);

module.exports = router;
