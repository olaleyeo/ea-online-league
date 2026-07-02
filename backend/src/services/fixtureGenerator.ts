import { Player } from '@prisma/client';
import { prisma } from '../prisma';

export async function generateLeagueFixtures(tournamentId: string) {
  const players = await prisma.player.findMany({ where: { tournamentId } });
  
  if (players.length < 8) {
    throw new Error('Not enough players to generate fixtures');
  }

  // Simplified generation for demonstration:
  // True Swiss system or complex pot-based generation is hard to guarantee 
  // without a proper CSP solver. We will implement a simplified random scheduler 
  // that tries to pair 8 unique matches per player.
  
  const fixtures: any[] = [];
  const matchCount: Record<string, number> = {};
  players.forEach(p => matchCount[p.id] = 0);

  // Randomize players
  const shuffled = [...players].sort(() => 0.5 - Math.random());

  let matchday = 1;

  for (let i = 0; i < shuffled.length; i++) {
    const p1 = shuffled[i];
    
    // Find opponents
    for (let j = i + 1; j < shuffled.length; j++) {
      const p2 = shuffled[j];
      
      if (matchCount[p1.id] < 8 && matchCount[p2.id] < 8) {
        // Assign home/away randomly
        const isHome = Math.random() > 0.5;
        fixtures.push({
          tournamentId,
          stage: 'LEAGUE',
          homePlayerId: isHome ? p1.id : p2.id,
          awayPlayerId: isHome ? p2.id : p1.id,
          matchday: matchday, // Simplified matchday assignment
        });
        matchCount[p1.id]++;
        matchCount[p2.id]++;
        if (fixtures.length % (players.length / 2) === 0) matchday++;
      }
    }
  }

  // Save to DB
  await prisma.fixture.createMany({ data: fixtures });

  // Initialize standings for all players if not exists
  for (const player of players) {
      await prisma.standing.upsert({
          where: { tournamentId_playerId: { tournamentId, playerId: player.id } },
          update: {},
          create: { tournamentId, playerId: player.id }
      });
  }

  return fixtures;
}
