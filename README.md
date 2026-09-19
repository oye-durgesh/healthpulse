# HealthPulse

HealthPulse is a mobile-first health companion that brings medicine schedules, reminder calls, emergency readiness, travel comfort, mood check-ins, and lightweight brain exercises into one persistent experience.

The application is designed as a responsive web app. Personal health information remains in the user's browser through local storage unless the user explicitly exports it.

## Features

- Medicine schedules, dose tracking, reminders, and reminder history
- Conversational medicine reminder sessions with ElevenLabs and a browser fallback
- Emergency information card with explicit field visibility controls
- Local demo QR sharing that does not embed medical history
- Guided Travel Mode with seated exercise demonstrations, timers, reminders, and comfort guidance
- Mood check-ins and supportive summaries
- Brain Gym activities and locally stored scores
- Light and dark themes
- Mobile-first, accessible interface with reduced-motion support
- Local JSON data export and data-clearing controls

## Technologies

- HTML, CSS, and browser JavaScript
- Node.js
- Express
- Replit Connectors SDK
- ElevenLabs Conversational AI
- Browser Local Storage, Web Speech, and Notification APIs

## Installation

Requirements:

- Node.js 18 or newer
- npm

```bash
git clone https://github.com/oye-durgesh/healthpulse.git
cd healthpulse
npm install
```

## Running the project

Start the application:

```bash
npm start
```

The server uses `PORT` when provided and otherwise listens on port `3000`.

For development with automatic process management, run the same server command through your preferred Node.js watcher.

## Environment variables

The application recognizes the following environment variable names:

- `PORT` — optional HTTP server port
- `ELEVENLABS_AGENT_ID` — optional ElevenLabs conversational agent identifier
- `ELEVENLABS_API_KEY` — optional; required only by the agent-creation endpoint
- `REPLIT_CONNECTORS_HOSTNAME` — injected by Replit when connectors are available
- `REPL_IDENTITY` — injected by Replit
- `WEB_REPL_RENEWAL` — injected by Replit

Never commit environment-variable values, API keys, connector credentials, or generated `.agent-config.json` files.

## Data and privacy

HealthPulse stores user-entered profile, medicine, reminder, mood, travel, and activity data in browser local storage. The repository contains demonstration seed entries only and does not contain private patient information.

Emergency QR sharing is explicitly demo-only: the QR contains a local demo identifier rather than medical history and is not a hospital or electronic-health-record integration.

## Safety

HealthPulse is a demonstration health companion. It does not diagnose, prescribe, prevent medical conditions, or replace professional medical advice. Users should stop exercises if they experience pain, dizziness, breathlessness, or unusual discomfort.

## License

No license has been assigned. All rights are reserved by the repository owner unless a license is added later.