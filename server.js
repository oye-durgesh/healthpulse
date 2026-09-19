const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { ReplitConnectors } = require('@replit/connectors-sdk');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CONFIG_FILE = path.join(__dirname, '.agent-config.json');
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_AGENT_ID =
  process.env.ELEVENLABS_AGENT_ID ||
  'agent_8801m2sfqvnfexgtq1ex3p8f38e5';
const connectors = new ReplitConnectors();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname, {
  index: false,
  etag: true,
  maxAge: '1h',
}));

app.get('/api/healthz', (_req, res) => {
  res.json({ status: 'ok', service: 'healthpulse' });
});

function getAgentId(_req, res) {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return res.json({ agent_id: null, configured: false });
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return res.json({
      agent_id: config.agent_id || null,
      configured: Boolean(config.agent_id),
    });
  } catch (error) {
    console.error('Unable to read ElevenLabs agent config:', error);
    return res.json({ agent_id: null, configured: false });
  }
}

app.get('/api/agent-id', getAgentId);
app.get('/healthpulse-api/agent-id', getAgentId);

async function elevenLabsJson(apiPath) {
  const response = await connectors.proxy('elevenlabs', apiPath, {
    method: 'GET',
  });
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function voiceStatus(_req, res) {
  try {
    const { response, body } = await elevenLabsJson(
      `/v1/convai/agents/${encodeURIComponent(ELEVENLABS_AGENT_ID)}`,
    );
    if (!response.ok) {
      return res.json({
        configured: true,
        verified: false,
        agentId: ELEVENLABS_AGENT_ID,
        state: response.status === 401 ? 'authorization_required' : 'unavailable',
      });
    }
    return res.json({
      configured: true,
      verified: true,
      agentId: ELEVENLABS_AGENT_ID,
      agentName: body.name || 'Reminder',
      state: 'ready',
    });
  } catch (error) {
    console.error('ElevenLabs status check failed:', error.message);
    return res.status(503).json({
      configured: true,
      verified: false,
      agentId: ELEVENLABS_AGENT_ID,
      state: 'unavailable',
    });
  }
}

async function voiceSession(_req, res) {
  try {
    const tokenResult = await elevenLabsJson(
      `/v1/convai/conversation/token?agent_id=${encodeURIComponent(ELEVENLABS_AGENT_ID)}`,
    );
    if (tokenResult.response.ok && tokenResult.body.token) {
      return res.json({
        mode: 'webrtc',
        conversationToken: tokenResult.body.token,
        agentId: ELEVENLABS_AGENT_ID,
      });
    }

    const signedResult = await elevenLabsJson(
      `/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(ELEVENLABS_AGENT_ID)}`,
    );
    if (signedResult.response.ok && signedResult.body.signed_url) {
      return res.json({
        mode: 'websocket',
        signedUrl: signedResult.body.signed_url,
        agentId: ELEVENLABS_AGENT_ID,
      });
    }

    return res.json({
      mode: 'public-agent-fallback',
      agentId: ELEVENLABS_AGENT_ID,
      error: 'Authenticated ElevenLabs session is not currently authorized.',
    });
  } catch (error) {
    console.error('ElevenLabs session creation failed:', error.message);
    return res.json({
      mode: 'public-agent-fallback',
      agentId: ELEVENLABS_AGENT_ID,
      error: 'ElevenLabs session service is unavailable.',
    });
  }
}

app.get('/api/voice/status', voiceStatus);
app.get('/healthpulse-api/voice/status', voiceStatus);
app.post('/api/voice/session', voiceSession);
app.post('/healthpulse-api/voice/session', voiceSession);

async function createAgent(_req, res) {
  if (!ELEVENLABS_API_KEY) {
    return res.status(400).json({
      error: 'ELEVENLABS_API_KEY not set. Add it in Replit Secrets.',
    });
  }

  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/convai/agents/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          name: 'HealthPulse Voice Companion',
          conversation_config: {
            agent: {
              prompt: {
                prompt: `You are HealthPulse, a warm and friendly AI health companion.

Speak naturally using short sentences and an encouraging tone.
You can help with medicine reminders, medicine schedules, mood summaries,
medicine price comparisons, practical health habits, and supportive chat.
Use Indian medicine names and rupee prices when relevant.
Never diagnose or prescribe. For medical concerns, suggest consulting a doctor.
Keep voice responses under three sentences.`,
              },
              first_message:
                "Hey! I'm your HealthPulse companion. I can help with medicine reminders, your schedule, or a quick health check-in. What can I help you with?",
              language: 'en',
            },
            tts: {
              voice_id: 'EXAVITQu4vr4xnSDxMaL',
            },
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok || !data.agent_id) {
      return res.status(response.status || 400).json({
        error: 'Failed to create ElevenLabs agent',
        details: data,
      });
    }

    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify(
        {
          agent_id: data.agent_id,
          created_at: new Date().toISOString(),
        },
        null,
        2,
      ),
      { mode: 0o600 },
    );

    return res.json({
      success: true,
      agent_id: data.agent_id,
      message: 'Voice agent created successfully.',
    });
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    return res.status(500).json({
      error: 'Failed to connect to ElevenLabs',
      message: error.message,
    });
  }
}

app.post('/api/create-agent', createAgent);
app.post('/healthpulse-api/create-agent', createAgent);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HealthPulse running on port ${PORT}`);
  if (!ELEVENLABS_API_KEY) {
    console.log(
      'ELEVENLABS_API_KEY is not configured; Web Speech fallback remains available.',
    );
  }
});