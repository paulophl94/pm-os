#!/usr/bin/env node
/**
 * Fetch full Fireflies transcript by ID
 * Usage: FIREFLIES_API_KEY=xxx node scripts/fetch-fireflies-transcript.mjs 01KG5F85CTVFQ6V6RT1R6ZZVYV
 */
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');
try {
  const env = readFileSync(envPath, 'utf8');
  env.split('\n').forEach((line) => {
    const [key, ...val] = line.split('=');
    if (key && val.length) {
      process.env[key.trim()] = val.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
} catch {}

const transcriptId = process.argv[2] || '01KG5F85CTVFQ6V6RT1R6ZZVYV';
const apiKey = process.env.FIREFLIES_API_KEY;

if (!apiKey) {
  console.error('Error: FIREFLIES_API_KEY not set. Set it in webapp/.env or as env var.');
  process.exit(1);
}

const query = `
  query GetFullTranscript($id: String!) {
    transcript(id: $id) {
      id
      title
      date
      duration
      participants
      dateString
      transcript_url
      speakers { id name }
      summary {
        overview
        action_items
        keywords
        outline
        shorthand_bullet
        bullet_gist
        short_summary
        short_overview
      }
      sentences {
        index
        speaker_name
        speaker_id
        text
        raw_text
        start_time
        end_time
      }
    }
  }
`;

const res = await fetch('https://api.fireflies.ai/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({ query, variables: { id: transcriptId } }),
});

const data = await res.json();
if (!res.ok) {
  console.error('API error:', res.status, data);
  process.exit(1);
}
if (data.errors) {
  console.error('GraphQL errors:', JSON.stringify(data.errors, null, 2));
  process.exit(1);
}

// Output as JSON for piping or inspection
console.log(JSON.stringify(data.data?.transcript ?? {}, null, 2));
