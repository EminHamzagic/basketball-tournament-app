import simulateMatch from "./SimulateMatch";

function simulateGroupStage(teams) {
  const results = teams.map((team) => ({
    ...team,
    wins: 0,
    pointsScored: 0,
    pointsAgainst: 0,
  }));

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const team1 = results[i];
      const team2 = results[j];
      const winner = simulateMatch(team1, team2);

      const points1 = Math.floor(Math.random() * 100) + 50; // Nasumično generisani poeni za tim 1
      const points2 = Math.floor(Math.random() * 100) + 50; // Nasumično generisani poeni za tim 2

      team1.pointsScored += points1;
      team2.pointsScored += points2;
      team1.pointsAgainst += points2;
      team2.pointsAgainst += points1;

      if (winner === team1) {
        team1.wins++;
      } else {
        team2.wins++;
      }
    }
  }

  // Sortiranje timova prema pravilima: broj pobeda, razlika u koševima, međusobni duel
  results.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins; // Broj pobeda
    const diffA = a.pointsScored - a.pointsAgainst;
    const diffB = b.pointsScored - b.pointsAgainst;
    if (diffA !== diffB) return diffB - diffA; // Razlika u koševima
    return b.pointsScored - a.pointsScored; // Ukupan broj postignutih poena
  });

  return results;
}
