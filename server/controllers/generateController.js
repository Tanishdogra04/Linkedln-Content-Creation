const StylePost = require('../models/StylePost');
const AnalyticsLog = require('../models/AnalyticsLog');
const aiService = require('../services/aiService');

// @desc    Generate LinkedIn post based on topic, industry, audience, and tone
// @route   POST /api/generate
// @access  Private
const generatePost = async (req, res) => {
  const { topic, industry, audience, tone } = req.body;

  if (!topic) {
    return res.status(400).json({ success: false, message: 'Please provide a topic' });
  }

  try {
    // 1. Fetch top style examples (RAG). Filter by category matching the industry or get recent examples
    // We can query examples matching the category or just fetch user's standard training library
    const styleExamples = await StylePost.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    // 2. AI analyzes examples and generates post
    const aiOutput = await aiService.generatePost({
      topic,
      industry: industry || 'Tech/Startups',
      audience: audience || 'Professionals',
      tone: tone || 'Confident',
      styleExamples
    });

    // 3. Log event in analytics
    await AnalyticsLog.create({
      type: 'generation',
      topic,
      user: req.user.id
    });

    res.json({
      success: true,
      data: {
        post: aiOutput.post,
        imageIdea: aiOutput.imageIdea
      }
    });
  } catch (error) {
    console.error('Generation controller error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generatePost
};
