# Bridge — Personalized AI Interview Support

Bridge is a neurodivergent-friendly interview preparation prototype. It reduces uncertainty, supports different processing and communication preferences, and helps users connect real experience to job-relevant strengths. It is not a diagnostic tool, a candidate-scoring system, or an employer monitoring product.

## Run locally

Node.js 20 or later is required.

```powershell
npm install
npm start
```

Open [http://127.0.0.1:8777/](http://127.0.0.1:8777/). The server hosts both the interface and API; do not open the HTML with `file://`. Stop it with `Ctrl+C`. To use another port in PowerShell:

```powershell
$env:PORT='8778'
npm start
```

The prototype uses plain HTML, CSS, and ES modules with no frontend build step. Poppins is used when installed locally, with system-font fallbacks and no font CDN.

## Product flow

1. **Support profile:** users select communication, information, and work-style preferences plus self-reported strengths. The profile is optional, visible, editable, and deletable. It never infers a neurological label.
2. **Job description:** users paste 1–5,000 characters or choose a sample. The product extracts skills, responsibilities, practice areas, and exact source quotes.
3. **Question generation:** AI can generate realistic questions grounded in the job description. Every question includes parts, possible focus areas, category, and challenge level. Invalid AI questions are replaced by templates. Nothing claims to predict exact employer questions.
4. **Mock interview:** users practice one question at a time with optional Need a moment, Clarify, and Break it down support. There is no countdown, emotion detection, eye-contact analysis, or response-speed assessment. Users choose, edit, and approve all suggested wording.
5. **Strength-to-evidence mapping:** answers are saved only when the user chooses. Every suggested strength requires a verbatim quote from the answer and may link to a sourced job requirement. The user keeps or rejects each suggestion. There are no scores or rankings.
6. **Reflection:** the interface reports answered questions, user-confirmed evidence, and support the user actively selected. Usage does not prove usefulness; the user decides whether to prioritize a support option.
7. **Interview Pack:** an on-screen summary separates self-reported strengths from confirmed evidence. It is not exported or sent to an employer.

Challenge level is user-controlled; it does not adapt automatically. The static bank contains 12 software-oriented questions across four categories. A spoken-information preference is recorded as a preference only—audio and text-to-speech are not implemented. The preparation map shows completed practice, not readiness or ability.

The expandable Clarification Assistant demonstrates a complete, user-approved loop: simulated interviewer question → clarification → manual approval → simulated response → user closes the loop. Trying to send without approval is blocked and creates no record. It does not contact a real person.

## Optional AI and configuration

The entire flow works without an API key through dictionaries, a static question bank, phrasing templates, and reflection prompts. When AI mode is off, the browser does not call `/api/`.

Create `.env` only when one does not already exist:

```powershell
Copy-Item .env.example .env
notepad .env
npm start
```

Set `GEMINI_API_KEY` and `GEMINI_MODEL`. The account must have access to a model that supports `generateContent` and structured JSON output. The key remains on the server and must never be committed or exposed to the browser. Without a key, the server still starts and returns `NO_KEY` fallbacks.

Enabling AI does not send content by itself. A request occurs only when the user activates an AI action. The support profile and support-usage history are never sent to Gemini. Requests are not retried automatically.

| Endpoint | Data sent after a user action | Fallback |
|---|---|---|
| `POST /api/interview/analyze-job` | Job description; the server adds its dictionary | Whole-word keyword extraction with source quotes |
| `POST /api/interview/generate-questions` | Job description and sourced job profile | 12 clearly labeled template questions |
| `POST /api/interview/analyze-answer` | Job context, question, and answer | Four reflection prompts: context, action, result, learning |
| `POST /api/clarify` | Current question and clarification type | Three prewritten options |

`/api/suggest` is intentionally absent and returns 404. The previous workplace-routing contract is not reused for interview preparation.

| HTTP | Contract |
|---|---|
| 200 | `mode: llm`; schema and heuristic checks passed, but the user must still review the meaning |
| 200 | `mode: fallback`; includes a `reasonCode` and safe local data |
| 400 | `mode: error`, `BAD_INPUT`; the interface shows the error and does not retry automatically |

The interview pipelines return `data`; clarification returns `options`. Network failures become `NETWORK_ERROR` fallbacks. `LOCAL_MODE` means the user deliberately chose the local path, not that an error occurred. New interview endpoints time out after 10 seconds on the server and 11 seconds in the browser; clarification uses 5 and 5.5 seconds. Changing inputs, questions, or modes cancels stale requests.

## Neurodivergence and user control

- Support is based on explicit user choices, never inferred from answer content, latency, voice, or passive behavior.
- There are no hidden diagnostic scores. Profile answers and prioritized support remain visible, editable, and deletable.
- Users never need to disclose a condition to practice.
- The product does not judge eye contact, speaking speed, personality, attention, productivity, or employability.
- There is no employer or HR dashboard and no automatic sharing with a real interviewer.
- AI helps with phrasing and evidence mapping; it never invents experience or confirms evidence on the user’s behalf.
- Neurodivergent people are not a single user type. Further development requires co-design and testing with people who have lived experience.

Design principle: **AI adapts the environment to the user, not the user to a fixed label.**

## Storage and privacy

- Only the self-reported profile and keep/remove support choices persist in local storage under `bridge:interview-profile`. The app can migrate the previous local key when the profile is next saved.
- Job descriptions, drafts, answers, evidence, support-use counts, and communication records stay in page memory and disappear on refresh.
- **Clear practice session** removes current practice content but keeps the profile. **Delete profile** removes the profile but does not erase current in-memory answers.
- Skipping profile setup applies only to the current session and does not delete a previously saved profile.
- Changing the job description clears saved results and evidence tied to the previous role, while question drafts remain. Editing an answer removes its analysis until the answer is saved again.
- The local proxy processes requests in memory and does not write user content to files or logs. The provider has its own retention policy; when AI is enabled, request data leaves the device.
- Do not use real personal information in demonstrations. Simulated roles in one browser do not provide security boundaries.

## Validation and tests

```powershell
npm run validate
npm test
```

The test suite covers schema validation, sourced extraction, AI fallback behavior, stale-request cancellation, user approval, evidence grounding, support profiles, and API input boundaries. Successful API tests use a fake provider; they do not prove Gemini output quality.

The optional browser smoke test uses Playwright with an installed browser:

```powershell
node scripts/smoke-interview.mjs
```

It covers local mode without API calls, profile persistence, job and question sources, question breakdown, empty filters, user-confirmed evidence, fallback behavior, HTTP 400 handling, clarification approval, session deletion, responsive widths, 200% CSS zoom, and reduced motion. This is not a WCAG certification or a complete screen-reader audit.

## Current limitations

Source quotes prove that text exists, not that an AI interpretation is correct. Keyword extraction can miss context or negation. Echoing an ID does not prove semantic alignment. Prompt boundaries reduce—but cannot eliminate—prompt injection risk. Dynamic content is rendered with `textContent`.

PDF upload, voice or video, a general chat platform, adaptive support or difficulty, file export, authentication, a database, and real hiring integrations are not implemented. The server binds only to localhost and is not production-ready.
