import express, { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireAdminPin } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { id: 'desc' },
      select: { id: true, name: true, ownerId: true, status: true, adminPin: true }
    });
    const sanitized = tournaments.map(t => {
      const { adminPin, ...rest } = t;
      return { ...rest, isLocked: !!adminPin };
    });
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, ownerId, adminPin } = req.body;
    let user = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!user) {
       user = await prisma.user.create({ data: { id: ownerId, name: 'Default Admin', email: `${ownerId}@example.com` }});
    }
    const tournament = await prisma.tournament.create({
      data: { name, ownerId: user.id, adminPin: adminPin || null }
    });
    const { adminPin: _, ...safeTournament } = tournament;
    res.json({ ...safeTournament, isLocked: !!tournament.adminPin });
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
    if (!tournament) return res.status(404).json({ error: 'Not found' });
    const { adminPin, ...safeTournament } = tournament;
    res.json({ ...safeTournament, isLocked: !!adminPin });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

// Players
router.post('/:id/players', requireAdminPin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const playersData = req.body.players; // Array of { name, rating, pot }
    
    await prisma.player.createMany({
      data: playersData.map((p: any) => ({ ...p, tournamentId: id }))
    });
    
    const players = await prisma.player.findMany({ where: { tournamentId: id } });
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
