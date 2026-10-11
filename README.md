# LLD Practice Platform

[![CI](https://github.com/berryO307/LLD-practice-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/berryO307/LLD-practice-platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Practice Low-Level Design the way you practice algorithms: pick a problem, write your
design, and get structured, rubric-scored feedback on it in seconds.

**Try it:** [solidly.vercel.app](https://solidly.vercel.app)

Built and maintained by **Barinder Singh** ([@berryO307](https://github.com/berryO307)).

## Why I built this

Low-Level Design (classes, responsibilities, interfaces, and how they collaborate) is a
core skill for software engineering interviews and for day-to-day work, but it's hard
to practice on your own:

- **There's no test case.** An algorithm either passes the tests or it doesn't. A design
  has no single correct answer to check against.
- **Several designs can all "work".** The difference between them only shows up when a
  new requirement arrives.
- **Good feedback is the bottleneck.** Real critique of trade-offs usually comes from a
  senior engineer or an interviewer, and that doesn't scale.

Algorithm platforms don't cover object design, courses can't review *your* design, and
a general-purpose AI chat tends to call every design "great" and score it differently
each time. So I built a practice loop with one rule: **every design is judged against
the same fixed rubric, and every score has to point at evidence in what you wrote.**

## How it works

**Choose a problem → write your design → submit → get feedback → review → try again.**

- **A fixed rubric.** Every design is scored on Responsibility Clarity, Coupling &
  Cohesion, SOLID & Pattern Adherence, and Extensibility & Trade-offs. Each dimension
  gets a score, a quote from your design as evidence, a concern, and a concrete
  suggestion, plus an overall score and a short summary.
- **Fast feedback.** Your design is saved the moment you submit and evaluated in the
  background, so the page never hangs.
- **Nothing is lost.** If an evaluation fails, your submission stays saved and you can
  retry it with one click.
- **History.** Every past attempt keeps your original design next to its feedback, so
  you can compare attempts and see what improved.

## Tech stack

React 19, Vite, Tailwind CSS · Node.js, Express 5 · PostgreSQL with Drizzle ORM ·
Google Gemini · Vitest

## Running locally

Requires Node.js 20+, a PostgreSQL database, and a
[Gemini API key](https://aistudio.google.com/apikey).

```bash
# Backend
cd server
npm install
cp .env.example .env      # then fill in your own values
npm run db:migrate
npm run db:seed
npm run dev

# Frontend (in a second terminal)
cd client
npm install
npm run dev
```

Run the tests with `npm test` in `server/`. They need no database or API key.

## Roadmap

- A redesigned UI and UX
- A freemium model: free practice with a limited number of evaluations, and a paid
  tier for unlimited evaluations and deeper feedback
- User accounts and progress tracking
- Class-diagram submissions alongside text
- A larger problem library

## License

[MIT](LICENSE) © 2026 Barinder Singh
