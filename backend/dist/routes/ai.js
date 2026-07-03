"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eloService_1 = require("../services/eloService");
const router = express_1.default.Router();
router.post('/ai/predict', (req, res) => {
    const { rating1, rating2 } = req.body;
    const p1 = (0, eloService_1.calculateWinProbability)(rating1, rating2);
    res.json({ prob1: p1, prob2: 1 - p1 });
});
router.post('/ai/simulate-match', (req, res) => {
    const { rating1, rating2 } = req.body;
    const result = (0, eloService_1.simulateScore)(rating1 || 1000, rating2 || 1000);
    res.json(result);
});
exports.default = router;
