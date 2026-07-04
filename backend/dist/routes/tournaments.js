"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../prisma");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const tournaments = await prisma_1.prisma.tournament.findMany({
            orderBy: { id: 'desc' },
            select: { id: true, name: true, ownerId: true, status: true, adminPin: true }
        });
        const sanitized = tournaments.map(t => {
            const { adminPin, ...rest } = t;
            return { ...rest, isLocked: !!adminPin };
        });
        res.json(sanitized);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, ownerId, adminPin } = req.body;
        let user = await prisma_1.prisma.user.findUnique({ where: { id: ownerId } });
        if (!user) {
            user = await prisma_1.prisma.user.create({ data: { id: ownerId, name: 'Default Admin', email: `${ownerId}@example.com` } });
        }
        const tournament = await prisma_1.prisma.tournament.create({
            data: { name, ownerId: user.id, adminPin: adminPin || null }
        });
        const { adminPin: _, ...safeTournament } = tournament;
        res.json({ ...safeTournament, isLocked: !!tournament.adminPin });
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
        if (!tournament)
            return res.status(404).json({ error: 'Not found' });
        const { adminPin, ...safeTournament } = tournament;
        res.json({ ...safeTournament, isLocked: !!adminPin });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tournament' });
    }
});
// Players
router.post('/:id/players', auth_1.requireAdminPin, async (req, res) => {
    try {
        const id = req.params.id;
        const playersData = req.body.players; // Array of { name, rating, pot }
        await prisma_1.prisma.player.createMany({
            data: playersData.map((p) => ({ ...p, tournamentId: id }))
        });
        const players = await prisma_1.prisma.player.findMany({ where: { tournamentId: id } });
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
