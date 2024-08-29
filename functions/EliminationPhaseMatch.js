function winProbability(rankA, rankB, formA, formB, factor = 30) {
  const baseDifference = rankB - rankA + (formB - formA);
  const baseProbability = 1 / (1 + Math.pow(10, baseDifference / factor));
  return Math.min(Math.max(baseProbability, 0), 1);
}

export default function simulateEliminationPhaseMatch(team1, team2) {
  let result = [];
  const probTeam1Wins = winProbability(
    team1.FIBARanking,
    team2.FIBARanking,
    team1.form,
    team2.form
  );
  let winner = Math.random() < probTeam1Wins ? team1 : team2;
  result.push(winner);
  let points1 = 0;
  let points2 = 0;
  let losser;
  if (winner === team1) {
    points1 = Math.floor(Math.random() * 60) + 70;
    points2 =
      Math.floor(Math.random() * (points1 - (points1 - 25))) + (points1 - 25);
    losser = team2;
  } else {
    points2 = Math.floor(Math.random() * 60) + 70;
    points1 =
      Math.floor(Math.random() * (points2 - (points2 - 25))) + (points2 - 25);
    losser = team1;
  }

  const formUpdate1 =
    points1 - points2 + (team2.FIBARanking - team1.FIBARanking) / 100;
  const formUpdate2 =
    points2 - points1 + (team1.FIBARanking - team2.FIBARanking) / 100;

  team1.form += formUpdate1 * 0.1; // Faktor uticaja forme
  team2.form += formUpdate2 * 0.1;

  result.push(`\t${team1.Team} - ${team2.Team} (${points1}:${points2})`);
  result.push(losser);
  return result;
}
