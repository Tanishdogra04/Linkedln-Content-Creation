const newsService = require('../services/newsService');
const StylePost = require('../models/StylePost');
const AnalyticsLog = require('../models/AnalyticsLog');
const aiService = require('../services/aiService');

// @desc    Perform trending news research and generate post ideas
// @route   GET /api/research
// @access  Private
const performResearch = async (req, res) => {
  try {
    // 1. Fetch latest business, AI, startup, and marketing news
    const articles = await newsService.fetchNews();
    if (!articles || articles.length === 0) {
      return res.status(404).json({ success: false, message: 'No articles found' });
    }

    // Pick the most recent/relevant article
    const article = articles[0];

    // 2. Fetch style examples for RAG
    const styleExamples = await StylePost.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(2);

    // 3. Generate summarized context, ideas, and LinkedIn post
    const topicText = `News Article: "${article.title}" - Description: "${article.description}"`;
    const aiOutput = await aiService.generatePost({
      topic: `Write a post reacting to or explaining the business impact of this news: ${topicText}`,
      industry: 'Business/AI News',
      audience: 'Professionals & Founders',
      tone: 'Informative & Bold',
      styleExamples
    });

    const contentIdea = `Explain the hidden opportunity of: ${article.title}. Break down why founders should care and how they can adapt.`;

    // 4. Log in analytics
    await AnalyticsLog.create({
      type: 'research',
      topic: article.title,
      user: req.user.id
    });

    res.json({
      success: true,
      data: {
        headline: article.title,
        summary: article.description,
        contentIdea: contentIdea,
        linkedinPost: aiOutput.post,
        imageIdea: aiOutput.imageIdea
      }
    });
  } catch (error) {
    console.error('Research controller error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  performResearch
};
