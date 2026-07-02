import { prisma } from '../prisma';

export async function recalculateStandings(tournamentId: string) {
  // Reset standings
  await prisma.standing.updateMany({
    where: { tournamentId },
    data: { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0 }
  });

  const fixtures = await prisma.fixture.findMany({
    where: { tournamentId, status: 'PLAYED', stage: 'LEAGUE' }
  });

  const standingsMap: Record<string, any> = {};

  const initPlayer = (id: string) => {
    if (!standingsMap[id]) {
      standingsMap[id] = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, points: 0 };
    }
  };

  for (const fixture of fixtures) {
    if (fixture.homeScore === null || fixture.awayScore === null) continue;
    
    initPlayer(fixture.homePlayerId);
    initPlayer(fixture.awayPlayerId);

    const h = standingsMap[fixture.homePlayerId];
    const a = standingsMap[fixture.awayPlayerId];

    h.played++;
    a.played++;
    h.gf += fixture.homeScore;
    h.ga += fixture.awayScore;
    a.gf += fixture.awayScore;
    a.ga += fixture.homeScore;

    if (fixture.homeScore > fixture.awayScore) {
      h.wins++;
      h.points += 3;
      a.losses++;
    } else if (fixture.homeScore < fixture.awayScore) {
      a.wins++;
      a.points += 3;
      h.losses++;
    } else {
      h.draws++;
      a.draws++;
      h.points += 1;
      a.points += 1;
    }

    h.gd = h.gf - h.ga;
    a.gd = a.gf - a.ga;
  }

  // Update DB
  for (const [playerId, data] of Object.entries(standingsMap)) {
    await prisma.standing.update({
      where: { tournamentId_playerId: { tournamentId, playerId } },
      data
    });
  }
}
