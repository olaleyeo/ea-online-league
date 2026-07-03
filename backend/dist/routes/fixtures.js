"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../prisma");
const fixtureGenerator_1 = require("../services/fixtureGenerator");
const standingService_1 = require("../services/standingService");
const router = express_1.default.Router();
// Generate league fixtures
router.post('/tournaments/:id/fixtures/league-generate', async (req, res) => {
    try {
        const fixtures = await (0, fixtureGenerator_1.generateLeagueFixtures)(req.params.id);
        res.json({ message: 'Fixtures generated successfully', fixtures });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get league fixtures
router.get('/tournaments/:id/fixtures', async (req, res) => {
    try {
        const stage = req.query.stage || 'LEAGUE';
        const fixtures = await prisma_1.prisma.fixture.findMany({
            where: { tournamentId: req.params.id, stage },
            include: { homePlayer: true, awayPlayer: true }
        });
        res.json(fixtures);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch fixtures' });
    }
});
// Update fixture score
router.patch('/fixtures/:id', async (req, res) => {
    try {
        const { homeScore, awayScore } = req.body;
        const fixture = await prisma_1.prisma.fixture.update({
            where: { id: req.params.id },
            data: { homeScore, awayScore, status: 'PLAYED' }
        });
        await (0, standingService_1.recalculateStandings)(fixture.tournamentId);
        res.json(fixture);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update fixture' });
    }
});
exports.default = router;
