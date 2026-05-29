const express = require('express');
const router = express.Router();
const { generatePost } = require('../controllers/generateController');
const { protect } = require('../middleware/auth');

router.post('/', protect, generatePost);

module.exports = router;
