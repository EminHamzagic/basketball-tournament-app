export default function calculateInitialForm(
  teamName,
  teamRank,
  exhibitions,
  teams
) {
  const matches = exhibitions[teamName];
  let form = 0;
  matches.forEach((match) => {
    const opponentTeam = teams.find((team) => team.ISOCode === match.Opponent);
    if (opponentTeam) {
      const opponentRank = opponentTeam.FIBARanking;
      let res = match.Result.split("-");
      const scoreDifference = parseInt(res[0]) - parseInt(res[1]);

      const opponentStrength = (teamRank - opponentRank) / 100;
      form += scoreDifference + opponentStrength;
    }
  });

  return form / matches.length;
}
