import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Growcial Intelligence Engine (GIE)
 * Self-learning AI that generates growth strategies based on user data and feedback
 */

const SYSTEM_PROMPT = `You are the Growcial Intelligence Engine (GIE), an AI specialized in social media growth strategies for creators.

Your job is to generate highly engaging, viral-worthy content strategies based on the user's niche, location, and language preferences.

RULES:
- Always be actionable and specific — no generic advice.
- Use trending formats (hooks, stories, data-driven, controversy, relatability).
- Adapt to the user's location for local trends.
- Generate content in the user's preferred language.
- If feedback history is provided, AVOID topics/styles that received "poor" feedback and LEAN INTO styles that received "good" feedback.
- Always return structured JSON.

You should return your response as a JSON array of objects, each with:
- "title": A short emoji-prefixed title
- "content": The full content (idea, hook, script, hashtags, or timing advice)
- "hashtags": An array of relevant hashtags (for hashtag type only)
`;

function buildPrompt(type, niche, location, language, additionalContext, feedbackHistory) {
  let typeInstruction = '';

  switch (type) {
    case 'ideas':
      typeInstruction = 'Generate 5 unique, viral-worthy content IDEAS for social media (Instagram Reels, YouTube Shorts).';
      break;
    case 'hooks':
      typeInstruction = 'Generate 5 attention-grabbing HOOKS / opening lines that stop the scroll.';
      break;
    case 'scripts':
      typeInstruction = 'Generate 2 complete SCRIPTS for 60-second reels/shorts. Include [HOOK], [BODY], and [CTA] sections.';
      break;
    case 'hashtags':
      typeInstruction = 'Generate 3 optimized HASHTAG SETS (mix of high-reach, medium, and niche-specific).';
      break;
    case 'timing':
      typeInstruction = 'Generate 3 specific BEST POSTING TIME recommendations with reasoning.';
      break;
    default:
      typeInstruction = 'Generate 5 viral content ideas.';
  }

  let prompt = `${typeInstruction}

NICHE: ${niche}
LOCATION: ${location || 'Global'}
LANGUAGE: ${language || 'English'}`;

  if (additionalContext) {
    prompt += `\nADDITIONAL CONTEXT: ${additionalContext}`;
  }

  if (feedbackHistory && feedbackHistory.length > 0) {
    const goodFeedback = feedbackHistory.filter(f => f.feedback === 'good');
    const poorFeedback = feedbackHistory.filter(f => f.feedback === 'poor');

    if (goodFeedback.length > 0) {
      prompt += `\n\nUSER LIKED THESE STYLES: ${goodFeedback.map(f => f.type).join(', ')}`;
    }
    if (poorFeedback.length > 0) {
      prompt += `\nUSER DISLIKED THESE: ${poorFeedback.map(f => f.type).join(', ')} — AVOID similar approaches.`;
    }
  }

  prompt += '\n\nReturn ONLY a valid JSON array. No markdown, no explanation.';

  return prompt;
}

export async function generateContent(type, niche, location, language, additionalContext, feedbackHistory) {
  const userPrompt = buildPrompt(type, niche, location, language, additionalContext, feedbackHistory);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content;
    const parsed = JSON.parse(raw);

    // Normalize response — handle both { results: [...] } and direct array
    const results = Array.isArray(parsed) ? parsed : (parsed.results || parsed.items || [parsed]);

    return results.map((item, i) => ({
      id: `gie-${Date.now()}-${i}`,
      title: item.title || `Result ${i + 1}`,
      content: item.content || item.text || '',
      hashtags: item.hashtags || [],
    }));
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('AI generation failed: ' + error.message);
  }
}
