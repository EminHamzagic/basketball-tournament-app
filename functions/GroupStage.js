import simulateMatch from "./SimulateMatch.js";

export default function simulateGroupMatches(teams, grp) {
  const results = teams.map((team) => ({
    ...team,
    wins: 0,
    losses: 0,
    points: 0,
    pointsScored: 0,
    pointsAgainst: 0,
    difference: 0,
  }));
  let playedMatches = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const team1 = results[i];
      const team2 = results[j];
      const winner = simulateMatch(team1, team2);
      let points1 = 0;
      let points2 = 0;
      if (winner === team1) {
        points1 = Math.floor(Math.random() * 60) + 70;
        points2 =
          Math.floor(Math.random() * (points1 - (points1 - 25))) +
          (points1 - 25);
      } else {
        points2 = Math.floor(Math.random() * 60) + 70;
        points1 =
          Math.floor(Math.random() * (points2 - (points2 - 25))) +
          (points2 - 25);
      }
      playedMatches.push(
        `${team1.Team} - ${team2.Team} (${points1}:${points2})`
      );

      team1.pointsScored += points1;
      team2.pointsScored += points2;
      team1.pointsAgainst += points2;
      team2.pointsAgainst += points1;

      team1.difference += points1 - points2;
      team2.difference += points2 - points1;

      // Azuriranje forme na osnovu rezultata utakmica
      const formUpdate1 =
        points1 - points2 + (team2.FIBARanking - team1.FIBARanking) / 100;
      const formUpdate2 =
        points2 - points1 + (team1.FIBARanking - team2.FIBARanking) / 100;

      team1.form += formUpdate1 * 0.1; // Faktor uticaja forme
      team2.form += formUpdate2 * 0.1;

      if (winner === team1) {
        team1.wins++;
        team1.points += 2;
        team2.losses++;
        team2.points += Math.random() < 0.5 ? 0 : 1;
      } else {
        team2.wins++;
        team2.points += 2;
        team1.losses++;
        team1.points += Math.random() < 0.5 ? 0 : 1;
      }
    }
  }

  // Sortiranje timova prema pravilima: broj pobeda, razlika u kosevima, medjusobni duel
  results.sort((a, b) => {
    if (b.points !== a.points) return b.wins - a.wins; // Broj pobeda
    if (a.difference !== b.difference) return b.difference - a.difference; // Razlika u kosevima
    return b.pointsScored - a.pointsScored; // Ukupan broj postignutih poena
  });

  return [results, playedMatches];
}
