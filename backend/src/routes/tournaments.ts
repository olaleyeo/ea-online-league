import express, { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, ownerId } = req.body;
    let user = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!user) {
       user = await prisma.user.create({ data: { id: ownerId, name: 'Default Admin', email: `${ownerId}@example.com` }});
    }
    const tournament = await prisma.tournament.create({
      data: { name, ownerId: user.id }
    });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id as string },
      include: { players: true, fixtures: true }
    });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

// Players
router.post('/:id/players', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const playersData = req.body.players; // Array of { name, rating, pot }
    const players = await prisma.$transaction(
      playersData.map((p: any) => prisma.player.create({
        data: { ...p, tournamentId: id }
      }))
    );
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add players' });
  }
});

router.get('/:id/players', async (req: Request, res: Response) => {
  try {
    const players = await prisma.player.findMany({ where: { tournamentId: req.params.id as string }});
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

export default router;
