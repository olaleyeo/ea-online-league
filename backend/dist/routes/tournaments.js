"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../prisma");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const tournaments = await prisma_1.prisma.tournament.findMany({
            orderBy: { id: 'desc' }
        });
        res.json(tournaments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, ownerId } = req.body;
        let user = await prisma_1.prisma.user.findUnique({ where: { id: ownerId } });
        if (!user) {
            user = await prisma_1.prisma.user.create({ data: { id: ownerId, name: 'Default Admin', email: `${ownerId}@example.com` } });
        }
        const tournament = await prisma_1.prisma.tournament.create({
            data: { name, ownerId: user.id }
        });
        res.json(tournament);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create tournament' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const tournament = await prisma_1.prisma.tournament.findUnique({
            where: { id: req.params.id },
            include: { players: true, fixtures: true }
        });
        res.json(tournament);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tournament' });
    }
});
// Players
router.post('/:id/players', async (req, res) => {
    try {
        const id = req.params.id;
        const playersData = req.body.players; // Array of { name, rating, pot }
        const players = await prisma_1.prisma.$transaction(playersData.map((p) => prisma_1.prisma.player.create({
            data: { ...p, tournamentId: id }
        })));
        res.json(players);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add players' });
    }
});
router.get('/:id/players', async (req, res) => {
    try {
        const players = await prisma_1.prisma.player.findMany({ where: { tournamentId: req.params.id } });
        res.json(players);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch players' });
    }
});
exports.default = router;
