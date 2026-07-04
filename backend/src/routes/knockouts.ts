import express, { Request, Response } from 'express';
import { prisma } from '../prisma';
import { generatePlayoffs, progressKnockoutStage } from '../services/bracketGenerator';
import { requireAdminPin } from '../middleware/auth';

const router = express.Router();

router.post('/tournaments/:id/knockout/generate', requireAdminPin, async (req: Request, res: Response) => {
  try {
    const ties = await generatePlayoffs(req.params.id as string);
    res.json({ message: 'Playoffs generated', ties });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/tournaments/:id/knockout/progress', requireAdminPin, async (req: Request, res: Response) => {
  try {
    const result = await progressKnockoutStage(req.params.id as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tournaments/:id/knockout', async (req: Request, res: Response) => {
  try {
    const ties = await prisma.knockoutTie.findMany({
      where: { tournamentId: req.params.id as string },
      include: { homePlayer: true, awayPlayer: true }
    });
    res.json(ties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ties' });
  }
});

router.patch('/knockout/:id', requireAdminPin, async (req: Request, res: Response) => {
  try {
    const { aggregateHome, aggregateAway } = req.body;
    let winnerId = req.body.winnerId;

    if (aggregateHome !== undefined && aggregateAway !== undefined && !winnerId) {
      const tie = await prisma.knockoutTie.findUnique({ where: { id: req.params.id as string } });
      if (tie) {
        if (aggregateHome > aggregateAway) winnerId = tie.homePlayerId;
        else if (aggregateAway > aggregateHome) winnerId = tie.awayPlayerId;
        else winnerId = Math.random() > 0.5 ? tie.homePlayerId : tie.awayPlayerId;
      }
    }

    const tie = await prisma.knockoutTie.update({
      where: { id: req.params.id as string },
      data: { aggregateHome, aggregateAway, winnerId }
    });
    res.json(tie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tie' });
  }
});

export default router;
