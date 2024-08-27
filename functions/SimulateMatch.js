function winProbability(rankA, rankB, factor = 20) {
  return 1 / (1 + Math.pow(10, (rankB - rankA) / factor));
}

export default function simulateMatch(team1, team2) {
  const t1WinProb = winProbability(team1.FIBARanking, team2.FIBARanking);
  const result = Math.random() < t1WinProb ? team1 : team2;
  return result;
}
