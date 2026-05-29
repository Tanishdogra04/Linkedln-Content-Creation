const StylePost = require('../models/StylePost');

// @desc    Get all style posts
// @route   GET /api/style
// @access  Private
const getStylePosts = async (req, res) => {
  try {
    const posts = await StylePost.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a style post
// @route   POST /api/style
// @access  Private
const createStylePost = async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ success: false, message: 'Please add all required fields' });
  }

  try {
    const post = await StylePost.create({
      title,
      content,
      category,
      user: req.user.id
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a style post
// @route   PUT /api/style/:id
// @access  Private
const updateStylePost = async (req, res) => {
  try {
    let post = await StylePost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Style post not found' });
    }

    // Verify ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this post' });
    }

    post = await StylePost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a style post
// @route   DELETE /api/style/:id
// @access  Private
const deleteStylePost = async (req, res) => {
  try {
    const post = await StylePost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Style post not found' });
    }

    // Verify ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Style post removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStylePosts,
  createStylePost,
  updateStylePost,
  deleteStylePost
};
