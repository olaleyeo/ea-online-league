import express, { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/tournaments/:id/standings', async (req: Request, res: Response) => {
  try {
    const standings = await prisma.standing.findMany({
      where: { tournamentId: req.params.id as string },
      include: { player: true },
      orderBy: [
        { points: 'desc' },
        { gd: 'desc' },
        { gf: 'desc' }
      ]
    });
    res.json(standings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});

export default router;
