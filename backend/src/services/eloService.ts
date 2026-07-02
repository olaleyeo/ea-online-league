export function calculateWinProbability(rating1: number, rating2: number): number {
  return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
}

export function simulateScore(rating1: number, rating2: number) {
  const prob1 = calculateWinProbability(rating1, rating2);
  const prob2 = 1 - prob1;

  // Simple poisson-like distribution based on probabilities
  const generateGoals = (prob: number) => {
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
