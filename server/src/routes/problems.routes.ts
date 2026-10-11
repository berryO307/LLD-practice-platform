import { Router } from 'express';
import { z } from 'zod';
import { ProblemRepository } from '../services/ProblemRepository.js';

const router = Router();
const problemRepo = new ProblemRepository();

// GET /api/problems — list seeded problems for the dashboard
router.get('/', async (_req, res) => {
  try {
    const problems = await problemRepo.listAll();
    res.json(
      problems.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
      })),
    );
  } catch (err) {
    console.error('Failed to list problems:', err);
    res.status(500).json({ error: 'Failed to list problems' });
  }
});

// GET /api/problems/:id — full detail for the practice workspace
router.get('/:id', async (req, res) => {
  // Postgres rejects a non-UUID value for a uuid column with an error; a
  // malformed id simply can't match any problem.
  if (!z.string().uuid().safeParse(req.params.id).success) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  try {
    const problem = await problemRepo.getById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (err) {
    console.error('Failed to get problem:', err);
    res.status(500).json({ error: 'Failed to get problem' });
  }
});

export default router;
