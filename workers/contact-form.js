/**
 * Cloudflare Worker — Contact Form Handler
 *
 * SPEC (placeholder implementation — not production-ready):
 *
 * Receives a POST request with JSON body:
 *   { name, email, message, utm_source?, utm_medium?, utm_campaign?,
 *     utm_content?, utm_term? }
 *
 * Steps:
 *   1. Validate required fields: name, email, message
 *   2. Append timestamp (ISO 8601) and user_agent from request headers
 *   3. Forward to contact email via Resend API
 *        POST https://api.resend.com/emails
 *        Authorization: Bearer {env.RESEND_API_KEY}
 *   4. Write a row to Google Sheet via Sheets API
 *        Requires env.GOOGLE_SHEET_ID and env.GOOGLE_SERVICE_ACCOUNT_JSON
 *        (service account must have Editor access to the sheet)
 *   5. Return JSON { success: true } or { success: false, error: string }
 *
 * CORS:
 *   - Allow requests only from env.SITE_BASE_URL
 *   - Reject with 403 for all other origins
 *
 * Environment variables (set in Cloudflare dashboard, never in code):
 *   RESEND_API_KEY              — Resend API key
 *   GOOGLE_SHEET_ID             — ID of the destination Google Sheet
 *   GOOGLE_SERVICE_ACCOUNT_JSON — JSON string of service account credentials
 *   SITE_BASE_URL               — Allowed CORS origin (e.g. https://andrewheins.ca)
 *
 * Deployment:
 *   wrangler deploy
 *   Worker URL is set as workerEndpoint in src/site.config.ts
 */

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.SITE_BASE_URL || '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (origin !== env.SITE_BASE_URL) {
      return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'name, email, and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build enriched payload
    const payload = {
      name,
      email,
      message,
      utm_source: body.utm_source || '',
      utm_medium: body.utm_medium || '',
      utm_campaign: body.utm_campaign || '',
      utm_content: body.utm_content || '',
      utm_term: body.utm_term || '',
      timestamp: new Date().toISOString(),
      user_agent: request.headers.get('User-Agent') || '',
    };

    // TODO: send email via Resend API (env.RESEND_API_KEY)
    // TODO: write row to Google Sheet (env.GOOGLE_SHEET_ID, env.GOOGLE_SERVICE_ACCOUNT_JSON)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },
};
