"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminPin = void 0;
const prisma_1 = require("../prisma");
const requireAdminPin = async (req, res, next) => {
    try {
        let tournamentId = (req.params.id || req.params.tournamentId);
        if (req.originalUrl.includes('/api/fixtures/')) {
            const fixture = await prisma_1.prisma.fixture.findUnique({ where: { id: req.params.id } });
            if (fixture)
                tournamentId = fixture.tournamentId;
        }
        else if (req.originalUrl.includes('/api/knockout/')) {
            const tie = await prisma_1.prisma.knockoutTie.findUnique({ where: { id: req.params.id } });
            if (tie)
                tournamentId = tie.tournamentId;
        }
        if (!tournamentId) {
            return res.status(400).json({ error: 'Could not determine tournament context' });
        }
        const tournament = await prisma_1.prisma.tournament.findUnique({ where: { id: tournamentId } });
        if (tournament?.adminPin) {
            const pinHeader = req.header('X-Admin-Pin');
            if (pinHeader !== tournament.adminPin) {
                return res.status(401).json({ error: 'Unauthorized: Invalid Admin PIN' });
            }
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};
exports.requireAdminPin = requireAdminPin;
