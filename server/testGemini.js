const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env BEFORE loading services
dotenv.config({ path: path.join(__dirname, '.env') });

const aiService = require('./services/aiService');

async function testAI() {
  console.log('Testing AI Service Integration...');
  
  const testParams = {
    topic: 'AI agents replacing traditional workflows',
    industry: 'Technology / SaaS',
    audience: 'Founders and Creators',
    tone: 'Bold and Direct',
    styleExamples: []
  };

  try {
    const result = await aiService.generatePost(testParams);
    
    console.log(`\n=== Success! ===\n`);
    console.log(JSON.stringify(result, null, 2));
    console.log('\n================================');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
  }
}

testAI();
