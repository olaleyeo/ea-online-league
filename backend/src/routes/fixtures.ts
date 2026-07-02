import express, { Request, Response } from 'express';
import { prisma } from '../prisma';
import { generateLeagueFixtures } from '../services/fixtureGenerator';
import { recalculateStandings } from '../services/standingService';

const router = express.Router();

// Generate league fixtures
router.post('/tournaments/:id/fixtures/league-generate', async (req: Request, res: Response) => {
  try {
    const fixtures = await generateLeagueFixtures(req.params.id as string);
    res.json({ message: 'Fixtures generated successfully', fixtures });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get league fixtures
router.get('/tournaments/:id/fixtures', async (req: Request, res: Response) => {
  try {
    const stage = req.query.stage as string || 'LEAGUE';
    const fixtures = await prisma.fixture.findMany({
      where: { tournamentId: req.params.id as string, stage },
      include: { homePlayer: true, awayPlayer: true }
    });
    res.json(fixtures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

// Update fixture score
router.patch('/fixtures/:id', async (req: Request, res: Response) => {
  try {
    const { homeScore, awayScore } = req.body;
    const fixture = await prisma.fixture.update({
      where: { id: req.params.id as string },
      data: { homeScore, awayScore, status: 'PLAYED' }
    });
    
    await recalculateStandings(fixture.tournamentId);

    res.json(fixture);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fixture' });
  }
});

export default router;
