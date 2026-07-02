import express, { Request, Response } from 'express';
import { simulateScore, calculateWinProbability } from '../services/eloService';

const router = express.Router();

router.post('/ai/predict', (req: Request, res: Response) => {
  const { rating1, rating2 } = req.body;
  const p1 = calculateWinProbability(rating1, rating2);
  res.json({ prob1: p1, prob2: 1 - p1 });
});

router.post('/ai/simulate-match', (req: Request, res: Response) => {
  const { rating1, rating2 } = req.body;
  const result = simulateScore(rating1 || 1000, rating2 || 1000);
  res.json(result);
});

export default router;
