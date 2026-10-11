# LLD Practice Platform

Practice Low-Level Design the way you practice algorithms: pick a problem, write your
design, and get structured, rubric-scored feedback on it in seconds.

**Live:** [solidly.vercel.app](https://solidly.vercel.app)

Built and maintained by **Barinder Singh** ([@berryO307](https://github.com/berryO307)).

## Why I built this

Low-Level Design (classes, responsibilities, interfaces, and how they collaborate) is a
core skill for software engineering interviews and for day-to-day work, but it's one of
the hardest skills to practice on your own:

- **There's no test case.** An algorithm either passes the hidden tests or it doesn't.
  A design has no single correct answer for a harness to check.
- **Several designs can all "work".** A `Vehicle` class with an `if/else` on type and a
  polymorphic `Vehicle` hierarchy both satisfy a parking-lot spec today. The difference
  only shows up when a new requirement arrives.
- **Good feedback is the bottleneck.** Real critique of trade-offs usually comes from a
  senior engineer or an interviewer, and that doesn't scale.

The existing options didn't close that gap for me. LeetCode-style platforms are built
for algorithms, not object decomposition. Courses teach SOLID and design patterns but
can't review *your* design. A general-purpose AI chat will review it, but tends to say
"looks great!" to flawed designs, scores differently from one day to the next, and gives
feedback you can't compare across attempts.

So I built a tight practice loop with one rule: **every submission is judged against
the same fixed rubric, and every score has to point at evidence in what you wrote.**

## How it works

**Choose a problem → write your design → submit → get feedback → review → try again.**

- **A fixed rubric.** Every design is scored on four dimensions: Responsibility
  Clarity, Coupling & Cohesion, SOLID & Pattern Adherence, and Extensibility &
  Trade-offs. Each dimension gets a 0–100 score, a quote from your submission as
  evidence, a concern, a concrete suggestion, and a confidence level, plus an overall
  score and a two-sentence summary. Explicit scoring bands keep results consistent:
  90–100 production-ready, 70–89 good with minor leaks, 50–69 noticeable
  anti-patterns, below 50 a fundamental misunderstanding.
- **Cheap checks first.** Empty or too-short submissions (under 50 characters) are
  rejected immediately at the API, before anything is stored or sent to the AI. The
  AI's judgment is only spent on designs worth judging.
- **No waiting on a slow request.** Your submission is saved first, the API responds
  right away, and evaluation runs in the background while the UI shows its progress.
- **Nothing is lost on failure.** If an evaluation fails (timeout, quota, malformed
  output), the submission stays saved and you can retry it with one click. Each attempt
  moves through an explicit state machine:
  `submitted → evaluating → completed | failed`, and `failed → evaluating` on retry.
- **History you can learn from.** Past attempts show your original submission, the
  summary, and the full rubric breakdown, collapsed until you open them.

### Built to grow

The core is written so that new capabilities plug in rather than requiring rewrites:

- **New submission formats.** Submissions sit behind a `Submission` interface. Text is
  the only format today; class-diagram submissions (UML, Mermaid) can be added as a
  new implementation without touching the evaluation flow, the API, or the database
  layer.
- **New evaluators.** Evaluation goes through an `EvaluationEngine` interface (the
  Strategy pattern). The AI evaluator is the only one wired in today, but a rule-based
  evaluator or human review can be added as one new class, since every evaluator
  returns the same feedback shape the UI already renders.
- **Resilient AI calls.** Evaluation calls have a timeout, retries with backoff for
  transient overloads, structured-output enforcement, and truncation detection. Every
  failure becomes a readable reason on the attempt instead of a crash.
- **Abuse protection.** Submission and retry endpoints share a rate limit, since both
  trigger a paid AI call.

## Tech stack

| Layer    | Tech                                                    |
|----------|---------------------------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS, Radix UI (shadcn-style components) |
| Backend  | Node.js, Express 5, Zod                                 |
| Database | PostgreSQL on Neon, Drizzle ORM                         |
| AI       | Google Gemini (`@google/genai`) with structured JSON output |
| Testing  | Vitest, Supertest                                       |
| Hosting  | Vercel (frontend), Railway (backend)                    |

## Project layout

```
client/   React frontend (Vite)
server/   Express API, Drizzle schema, domain logic, tests
  src/domain/     Submission, EvaluationEngine, LLMEvaluator, Attempt, Rubric, Feedback
  src/services/   AttemptService (orchestration), ProblemRepository
  src/routes/     REST endpoints
```

## Running locally

### Prerequisites

- Node.js 20+
- A PostgreSQL database. [Neon](https://neon.tech)'s free tier works, as does any
  Postgres 14+ instance.
- A [Gemini API key](https://aistudio.google.com/apikey)

### Backend (`server/`)

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:

```
DATABASE_URL=postgresql://user:password@your-host/your-db?sslmode=require
PORT=4000
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
SUBMIT_RATE_LIMIT=5
```

Create the tables and seed the practice problems. The seed is safe to re-run.

```bash
npm run db:generate   # generate SQL migrations from src/db/schema.ts
npm run db:migrate    # apply migrations to DATABASE_URL
npm run db:seed       # insert/update the practice problems and a demo user
npm run dev           # http://localhost:4000
```

### Frontend (`client/`)

```bash
cd client
npm install
npm run dev           # http://localhost:5173
```

Locally the frontend calls `http://localhost:4000/api` by default, so no frontend env
file is needed as long as the backend's `FRONTEND_URL` is `http://localhost:5173`.

### Tests

```bash
cd server
npm test
```

The suite needs no database or API key; everything external is mocked or injected.
It covers:
- unit tests for the attempt state machine, submission validation, and the AI
  evaluator (`src/domain/*.test.ts`), and
- integration tests against the real Express app with an in-memory database
  (`src/__tests__/attempt.test.ts`): input validation, retry transitions and their error
  codes, and evaluation failures being recorded without crashing the server.

## Deployment

### Backend on Railway

1. **New Project → Deploy from GitHub repo**, then select this repository.
2. In the service's settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Healthcheck Path:** `/health`
3. Add variables: `DATABASE_URL`, `GEMINI_API_KEY`, `FRONTEND_URL` (your frontend's
   URL, used for CORS), and optionally `SUBMIT_RATE_LIMIT`. Railway sets `PORT`
   itself. Don't set `NODE_ENV=production`, because the TypeScript build needs dev
   dependencies installed.
4. **Settings → Networking → Generate Domain** to get a public URL.
5. Run `npm run db:migrate` and `npm run db:seed` once against the production database.

### Frontend on Vercel

1. Import the repository and set the **Root Directory** to `client`. The framework
   preset is Vite.
2. Add `VITE_API_URL` set to your backend's public URL plus `/api`, for example
   `https://your-api.up.railway.app/api`.
3. Deploy. Vite builds `VITE_API_URL` into the bundle, so redeploy whenever you change
   it.

### Secrets stay out of the repo

`server/.env` and `client/.env` are gitignored; only `.env.example` templates with
placeholder values are committed. To run the project you need your own database URL
and Gemini API key. Never put a secret in a `VITE_` variable, because those are
shipped to the browser.

## Roadmap

- A redesigned UI and UX
- A freemium model: free practice with a limited number of AI evaluations, and a paid
  tier for unlimited evaluations and deeper feedback
- User accounts and progress tracking across attempts
- Class-diagram submissions (UML or Mermaid) alongside text
- A larger problem library
- A rule-based evaluator as a fast, free first pass before AI review

## Troubleshooting

- **`DATABASE_URL is not set`:** copy `server/.env.example` to `server/.env` and fill it in.
- **`GEMINI_API_KEY is not configured for LLMEvaluator`:** evaluations fail until the
  key is set. Submissions are still saved and can be retried afterwards.
- **`Too many submissions from this client`:** the submit and retry endpoints share a
  rate limit (`SUBMIT_RATE_LIMIT`, default 5 per 15 minutes). Wait for the window to
  reset, or raise the limit locally.
- **`Evaluation failed` in the UI:** use **Retry Evaluation** in the History tab. The
  original submission is never deleted.
- **Migrations fail against Neon:** make sure `sslmode=require` is in the connection string.

## License

[MIT](LICENSE) © 2026 Barinder Singh
