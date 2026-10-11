import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import problemsRouter from './routes/problems.routes.js';
import attemptsRouter from './routes/attempts.routes.js';
import usersRouter from './routes/users.routes.js';

export function createApp() {
  const app = express();

  // Behind the hosting platform's load balancer every request arrives from the
  // proxy's IP; without this, the rate limiter would put all users in one bucket.
  app.set('trust proxy', 1);

  app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/problems', problemsRouter);
  app.use('/api/attempts', attemptsRouter);
  app.use('/api/me', usersRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    // body-parser sets a 4xx status for malformed JSON and oversized bodies.
    const status = typeof err?.status === 'number' && err.status >= 400 && err.status < 500 ? err.status : 500;
    if (status === 500) {
      console.error('Unhandled error:', err);
    }
    res.status(status).json({ error: status === 500 ? 'Internal server error' : 'Invalid request body' });
  };
  app.use(errorHandler);

  return app;
}
