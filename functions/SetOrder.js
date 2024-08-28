export default function setTeamOrder(teams) {
  return teams.sort((a, b) => {
    if (b.points !== a.points) return b.wins - a.wins;
    if (a.difference !== b.difference) return b.difference - a.difference;
    return b.pointsScored - a.pointsScored;
  });
}
