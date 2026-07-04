"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../prisma");
const bracketGenerator_1 = require("../services/bracketGenerator");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/tournaments/:id/knockout/generate', auth_1.requireAdminPin, async (req, res) => {
    try {
        const ties = await (0, bracketGenerator_1.generatePlayoffs)(req.params.id);
        res.json({ message: 'Playoffs generated', ties });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/tournaments/:id/knockout/progress', auth_1.requireAdminPin, async (req, res) => {
    try {
        const result = await (0, bracketGenerator_1.progressKnockoutStage)(req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/tournaments/:id/knockout', async (req, res) => {
    try {
        const ties = await prisma_1.prisma.knockoutTie.findMany({
            where: { tournamentId: req.params.id },
            include: { homePlayer: true, awayPlayer: true }
        });
        res.json(ties);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch ties' });
    }
});
router.patch('/knockout/:id', auth_1.requireAdminPin, async (req, res) => {
    try {
        const { aggregateHome, aggregateAway } = req.body;
        let winnerId = req.body.winnerId;
        if (aggregateHome !== undefined && aggregateAway !== undefined && aggregateHome !== null && aggregateAway !== null && !winnerId) {
            const tie = await prisma_1.prisma.knockoutTie.findUnique({ where: { id: req.params.id } });
            if (tie) {
                if (aggregateHome > aggregateAway)
                    winnerId = tie.homePlayerId;
                else if (aggregateAway > aggregateHome)
                    winnerId = tie.awayPlayerId;
                else
                    winnerId = Math.random() > 0.5 ? tie.homePlayerId : tie.awayPlayerId;
            }
        }
        const tie = await prisma_1.prisma.knockoutTie.update({
            where: { id: req.params.id },
            data: { aggregateHome, aggregateAway, winnerId }
        });
        res.json(tie);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update tie' });
    }
});
exports.default = router;
