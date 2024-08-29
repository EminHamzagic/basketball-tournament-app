function winProbability(rankA, rankB, formA, formB, factor = 30) {
  const baseDifference = rankB - rankA + (formB - formA);
  const baseProbability = 1 / (1 + Math.pow(10, baseDifference / factor));
  return Math.min(Math.max(baseProbability, 0), 1);
}

export default function simulateMatch(team1, team2) {
  const probTeam1Wins = winProbability(
    team1.FIBARanking,
    team2.FIBARanking,
    team1.form,
    team2.form
  );
  const result = Math.random() < probTeam1Wins ? team1 : team2;
  return result;
}
