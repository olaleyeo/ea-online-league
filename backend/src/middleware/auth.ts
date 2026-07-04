import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

export const requireAdminPin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let tournamentId = (req.params.id || req.params.tournamentId) as string;

    if (req.originalUrl.includes('/api/fixtures/')) {
      const fixture = await prisma.fixture.findUnique({ where: { id: req.params.id as string } });
      if (fixture) tournamentId = fixture.tournamentId;
    } else if (req.originalUrl.includes('/api/knockout/')) {
      const tie = await prisma.knockoutTie.findUnique({ where: { id: req.params.id as string } });
      if (tie) tournamentId = tie.tournamentId;
    }

    if (!tournamentId) {
      return res.status(400).json({ error: 'Could not determine tournament context' });
    }

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    
    if (tournament?.adminPin) {
      const pinHeader = req.header('X-Admin-Pin');
      if (pinHeader !== tournament.adminPin) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Admin PIN' });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};
