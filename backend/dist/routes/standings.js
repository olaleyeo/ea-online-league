"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../prisma");
const router = express_1.default.Router();
router.get('/tournaments/:id/standings', async (req, res) => {
    try {
        const standings = await prisma_1.prisma.standing.findMany({
            where: { tournamentId: req.params.id },
            include: { player: true },
            orderBy: [
                { points: 'desc' },
                { gd: 'desc' },
                { gf: 'desc' }
            ]
        });
        res.json(standings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch standings' });
    }
});
exports.default = router;
