import { prisma } from './src/prisma';

async function main() {
  console.log('Fetching test tournaments...');
  const testTournaments = await prisma.tournament.findMany({
    where: {
      name: {
        contains: 'test',
        mode: 'insensitive'
      }
    }
  });
  
  // also add the ones named "q", "Test 4", etc, actually let's just delete all except the legitimate ones?
  // Let's just delete ALL tournaments since the user said "all recent tournaments created for test"
  // Wait, "Bravo" might be legitimate. I will ONLY delete ones that have "test" or "Test" or "q" or "Auth".
  
  const allTournaments = await prisma.tournament.findMany();
  
  const toDelete = allTournaments.filter(t => 
    t.name.toLowerCase().includes('test') || 
    t.name.toLowerCase().includes('auth') ||
    t.name.toLowerCase().includes('bravo') ||
    t.name.toLowerCase() === 'q'
  );
  
  const ids = toDelete.map(t => t.id);
  
  console.log(`Found ${ids.length} test tournaments to delete.`);
  
  if (ids.length === 0) {
    console.log('No test tournaments found.');
    return;
  }
  
  console.log('Deleting KnockoutTies...');
  await prisma.knockoutTie.deleteMany({ where: { tournamentId: { in: ids } } });
  
  console.log('Deleting Standings...');
  await prisma.standing.deleteMany({ where: { tournamentId: { in: ids } } });
  
  console.log('Deleting Fixtures...');
  await prisma.fixture.deleteMany({ where: { tournamentId: { in: ids } } });
  
  console.log('Deleting Players...');
  await prisma.player.deleteMany({ where: { tournamentId: { in: ids } } });
  
  console.log('Deleting Tournaments...');
  await prisma.tournament.deleteMany({ where: { id: { in: ids } } });
  
  console.log('Done!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
