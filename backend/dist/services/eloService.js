"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWinProbability = calculateWinProbability;
exports.simulateScore = simulateScore;
function calculateWinProbability(rating1, rating2) {
    return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
}
function simulateScore(rating1, rating2) {
    const prob1 = calculateWinProbability(rating1, rating2);
    const prob2 = 1 - prob1;
    // Simple poisson-like distribution based on probabilities
    const generateGoals = (prob) => {
        let goals = 0;
        while (Math.random() < prob * 0.7) {
            goals++;
            prob *= 0.6; // decaying chance of scoring more goals
        }
        return goals;
    };
    return {
        score1: generateGoals(prob1),
        score2: generateGoals(prob2)
    };
}
