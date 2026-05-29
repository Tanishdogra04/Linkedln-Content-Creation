const express = require('express');
const router = express.Router();
const { getStylePosts, createStylePost, updateStylePost, deleteStylePost } = require('../controllers/styleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getStylePosts)
  .post(createStylePost);

router.route('/:id')
  .put(updateStylePost)
  .delete(deleteStylePost);

module.exports = router;
