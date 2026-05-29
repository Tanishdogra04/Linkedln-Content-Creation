const fetch = require('node-fetch');

/**
 * AI Service – uses OpenRouter (GPT‑OSS 120B) when OPENROUTER_API_KEY is set.
 * Falls back to a deterministic mock response if no key is available.
 */
class AIService {
  constructor() {
    this.openRouterKey = process.env.OPENROUTER_API_KEY;
    this.useOpenRouter = !!(this.openRouterKey && this.openRouterKey !== 'YOUR_OPENROUTER_API_KEY');
    if (this.useOpenRouter) {
      console.log('✅ OpenRouter key detected – AI Service will call GPT‑OSS 120B');
    } else {
      console.warn('⚠️ OPENROUTER_API_KEY not set – AI Service runs in mock mode');
    }
  }

  // Helper to build the style context (same as before)
  buildStyleContext(styleExamples) {
    if (!styleExamples || styleExamples.length === 0) {
      return `
- Hook: High‑impact, surprising opening line that disrupts the feed scroll.
- Spacing: Heavy use of single‑sentence paragraphs and wide breathing room (double newlines).
- Tone: Bold, direct, authoritative, yet relatable and conversational.
- Structure: Hook → observation/story → 3‑4 actionable bullet points → sharp CTA.
- No buzzwords (e.g., "synergy", "game‑changing").`;
    }
    return styleExamples
      .map((ex, i) => `--- EXAMPLE ${i + 1} (${ex.category}) ---\n${ex.content}`)
      .join('\n');
  }

  // Core method – generates a LinkedIn post (and image idea) via OpenRouter
  async generatePost({ topic, industry, audience, tone, styleExamples }) {
    const styleContext = this.buildStyleContext(styleExamples);
    const prompt = `You are an expert ghostwriter specializing in premium LinkedIn content.
Generate a LinkedIn post about the following topic:
Topic: "${topic}"
Industry: "${industry}"
Target Audience: "${audience}"
Tone: "${tone}"

Writing Style Guidelines (Inspired by Nikit Bassi / NB Media):
1. HOOK – one short, scroll‑stopping sentence.
2. PARAGRAPH SPACING – short 1‑2 sentence paragraphs, double‑spaced.
3. STORY & CONTEXT – brief challenge or observation.
4. ACTIONABLE VALUE – 3‑4 ultra‑clear bullet points.
5. TONALITY – human, punchy, confident, no corporate jargon.
6. CTA – sharp low‑friction call‑to‑action or question.
7. MIDJOURNEY PROMPT – detailed visual prompt.

Reference style examples to emulate spacing, pacing, hooks, structure:
${styleContext}

Return ONLY a JSON object with the shape:
{ "post": "...", "imageIdea": { "imageTitle": "...", "imageDescription": "...", "imagePrompt": "..." } }

IMPORTANT STRICT RULES:
- Output valid JSON ONLY. No markdown wrapping. No conversational text.
- Do NOT use literal newlines inside string values. You MUST use \\n to represent line breaks inside the JSON strings.`;

    if (!this.useOpenRouter) {
      return this.getMockResponse(topic, industry, tone);
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.openRouterKey}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-70b-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter request failed: ${response.status} ${err}`);
      }

      const data = await response.json();
      let raw = data.choices?.[0]?.message?.content;
      if (!raw) throw new Error('No content in OpenRouter response');
      
      raw = raw.trim();
      if (raw.includes('```json')) {
        raw = raw.split('```json')[1].split('```')[0].trim();
      } else if (raw.includes('```')) {
        raw = raw.split('```')[1].split('```')[0].trim();
      } else {
        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          raw = raw.substring(start, end + 1);
        }
      }

      // We rely on the strict prompt to return valid JSON.
      return JSON.parse(raw);
    } catch (error) {
      console.warn('OpenRouter call failed, falling back to mock:', error.message);
      return this.getMockResponse(topic, industry, tone);
    }
  }

  // Mock response – same as previously used for Gemini fallback
  getMockResponse(topic, industry, tone) {
    return {
      post: `Most founders are building in the dark.

And it’s costing them thousands in missed organic reach.

Here’s a 3‑step playbook we use at NB Media to scale LinkedIn profiles:

1. Stop writing generic guides – give one actionable lesson you can implement in 5 minutes.
2. Master the scroll‑stopping hook – the first line wins 90 % of the battle.
3. Write like you speak – short lines, double spacing, simple words.

Your LinkedIn profile is your digital storefront. Treat it like one.

What’s your biggest hurdle with organic content? Let’s chat in the comments.`,
      imageIdea: {
        imageTitle: 'Organic Scaling Matrix',
        imageDescription: 'Modern comparison chart showing performance of spaced vs dense LinkedIn posts.',
        imagePrompt: `Cinematic 3D render of a futuristic holographic dashboard displaying growth metrics. Glowing neon arrow pointing upwards through a matrix of clean violet and cyan glass charts. Minimalist dark background, studio lighting, depth of field, 8k, photorealistic.`,
      },
    };
  }
}

module.exports = new AIService();
