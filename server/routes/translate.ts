import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const ALLOWED_CONTENT_TYPES = new Set(['article', 'forum_topic', 'forum_reply', 'event']);
const ALLOWED_LANGS = new Set(['fr', 'en']);
const MAX_FIELD_LENGTH = 8000;
const MAX_TOTAL_LENGTH = 12000;

// Simple in-memory sliding-window limiter — resets on restart, adequate for
// a single-VPS deployment (mirrors the IP-based dedup style in visitors.ts).
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

router.post('/', async (req: Request, res: Response) => {
  if (!GROQ_API_KEY) {
    return res.status(503).json({ error: 'Translation service is not configured.' });
  }

  const ip = req.ip || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many translation requests. Please try again later.' });
  }

  const { contentType, contentId, targetLang, fields } = req.body || {};

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return res.status(400).json({ error: 'Invalid contentType.' });
  }
  if (!contentId || typeof contentId !== 'string') {
    return res.status(400).json({ error: 'contentId is required.' });
  }
  if (!ALLOWED_LANGS.has(targetLang)) {
    return res.status(400).json({ error: "targetLang must be 'fr' or 'en'." });
  }
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    return res.status(400).json({ error: 'fields must be an object of string values.' });
  }

  const entries = Object.entries(fields).filter(
    ([, v]) => typeof v === 'string' && v.trim().length > 0
  ) as [string, string][];
  if (entries.length === 0) {
    return res.status(400).json({ error: 'No translatable text provided.' });
  }
  let total = 0;
  for (const [key, value] of entries) {
    if (value.length > MAX_FIELD_LENGTH) {
      return res.status(400).json({ error: `Field "${key}" exceeds the ${MAX_FIELD_LENGTH} character limit.` });
    }
    total += value.length;
  }
  if (total > MAX_TOTAL_LENGTH) {
    return res.status(400).json({ error: `Combined text exceeds the ${MAX_TOTAL_LENGTH} character limit.` });
  }

  const cached = db.query(
    'SELECT translated_json FROM translations_cache WHERE content_type = ? AND content_id = ? AND target_lang = ?'
  ).get(contentType, contentId, targetLang) as { translated_json: string } | null;

  if (cached) {
    return res.json({ translated: JSON.parse(cached.translated_json), cached: true });
  }

  const sourceLangLabel = targetLang === 'en' ? 'French' : 'English';
  const targetLangLabel = targetLang === 'en' ? 'English' : 'French';
  const payload = Object.fromEntries(entries);

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              `You are a professional translator for a sports association website. ` +
              `Translate the string values of the JSON object the user sends from ${sourceLangLabel} to ${targetLangLabel}. ` +
              `Preserve the original meaning, tone, and paragraph breaks (keep blank-line breaks between paragraphs). ` +
              `Return ONLY a valid JSON object with the exact same keys, containing the translated text — no commentary, no markdown.`,
          },
          { role: 'user', content: JSON.stringify(payload) },
        ],
      }),
    });

    if (!groqRes.ok) {
      console.error('Groq translation request failed:', groqRes.status, await groqRes.text().catch(() => ''));
      return res.status(502).json({ error: 'Translation service error. Please try again later.' });
    }

    const data = await groqRes.json();
    const raw = data?.choices?.[0]?.message?.content;
    let translated: Record<string, string>;
    try {
      translated = JSON.parse(raw);
    } catch {
      console.error('Groq translation returned non-JSON content:', raw);
      return res.status(502).json({ error: 'Translation service returned an unexpected response.' });
    }

    db.prepare(
      'INSERT OR REPLACE INTO translations_cache (content_type, content_id, target_lang, translated_json, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(contentType, contentId, targetLang, JSON.stringify(translated), new Date().toISOString());

    return res.json({ translated, cached: false });
  } catch (err) {
    console.error('Translation request failed:', err);
    return res.status(502).json({ error: 'Translation service is unreachable. Please try again later.' });
  }
});

export default router;
