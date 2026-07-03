"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlayoffs = generatePlayoffs;
exports.progressKnockoutStage = progressKnockoutStage;
const prisma_1 = require("../prisma");
async function generatePlayoffs(tournamentId) {
    const standings = await prisma_1.prisma.standing.findMany({
        where: { tournamentId },
        orderBy: [
            { points: 'desc' },
            { gd: 'desc' },
            { gf: 'desc' }
        ]
    });
    const numPlayers = standings.length;
    let playoffTeams = [];
    let tiesCount = 0;
    let stageName = 'PLAYOFF';
    if (numPlayers === 8) {
        playoffTeams = standings;
        tiesCount = 4;
        stageName = 'QUARTER_FINAL';
    }
    else if (numPlayers === 16) {
        playoffTeams = standings;
        tiesCount = 8;
        stageName = 'ROUND_OF_16';
    }
    else if (numPlayers >= 24) {
        playoffTeams = standings.slice(8, 24);
        tiesCount = 8;
        stageName = 'PLAYOFF';
    }
    else {
        throw new Error('Unsupported number of teams');
    }
    const ties = [];
    const totalPlayoffTeams = playoffTeams.length;
    for (let i = 0; i < tiesCount; i++) {
        const home = playoffTeams[i];
        const away = playoffTeams[totalPlayoffTeams - 1 - i];
        ties.push({
            tournamentId,
            stage: stageName,
            homePlayerId: home.playerId,
            awayPlayerId: away.playerId,
            aggregateHome: 0,
            aggregateAway: 0
        });
    }
    await prisma_1.prisma.knockoutTie.createMany({ data: ties });
    return ties;
}
async function progressKnockoutStage(tournamentId) {
    const allTies = await prisma_1.prisma.knockoutTie.findMany({
        where: { tournamentId },
        orderBy: { id: 'asc' }
    });
    const stages = ['PLAYOFF', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL'];
    let currentStage = 'PLAYOFF';
    let currentTies = [];
    for (let i = stages.length - 1; i >= 0; i--) {
        const stageTies = allTies.filter(t => t.stage === stages[i]);
        if (stageTies.length > 0) {
            currentStage = stages[i];
            currentTies = stageTies;
            break;
        }
    }
    if (currentTies.length === 0 || currentTies.some(t => !t.winnerId)) {
        throw new Error('Not all matches in the current stage are completed');
    }
    const currentStageIndex = stages.indexOf(currentStage);
    if (currentStageIndex === stages.length - 1) {
        await prisma_1.prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: 'FINISHED' }
        });
        return { status: 'FINISHED' };
    }
    const nextStage = stages[currentStageIndex + 1];
    const nextTies = [];
    if (currentStage === 'PLAYOFF') {
        const standings = await prisma_1.prisma.standing.findMany({
            where: { tournamentId },
            orderBy: [{ points: 'desc' }, { gd: 'desc' }, { gf: 'desc' }],
            take: 8
        });
        for (let i = 0; i < 8; i++) {
            nextTies.push({
                tournamentId,
                stage: 'ROUND_OF_16',
                homePlayerId: standings[i].playerId,
                awayPlayerId: currentTies[7 - i].winnerId,
                aggregateHome: 0,
                aggregateAway: 0
            });
        }
    }
    else {
        for (let i = 0; i < currentTies.length; i += 2) {
            const tie1 = currentTies[i];
            const tie2 = currentTies[i + 1];
            if (tie1 && tie2) {
                nextTies.push({
                    tournamentId,
                    stage: nextStage,
                    homePlayerId: tie1.winnerId,
                    awayPlayerId: tie2.winnerId,
                    aggregateHome: 0,
                    aggregateAway: 0
                });
            }
        }
    }
    if (nextTies.length > 0) {
        await prisma_1.prisma.knockoutTie.createMany({ data: nextTies });
    }
    return { status: 'PROGRESSED', nextStage };
}
