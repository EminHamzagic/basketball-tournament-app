import calculateInitialForm from "./functions/InitalForms.js";
import simulateGroupMatches from "./functions/GroupStage.js";
import setTeamOrder from "./functions/SetOrder.js";
import simulateEliminationPhaseMatch from "./functions/EliminationPhaseMatch.js";
import fs from "fs";

//Dobavljanje podataka iz json fajlova
const groupsStr = await fs.promises.readFile("./data/groups.json", "utf8");
const exibitionsStr = await fs.promises.readFile(
  "./data/exibitions.json",
  "utf8"
);
var groups = JSON.parse(groupsStr);
const exibitions = JSON.parse(exibitionsStr);
//Deklaracija niza koji sadrzi sve timove
const teams = [];

//Dodavanje atributa forma timovima
for (let key in groups)
  groups[key].forEach((team) => {
    team.form = 0;
  });

//Dodavanje svakog tima u niz
for (let key in groups)
  groups[key].forEach((team) => {
    teams.push(team);
  });

//Kalkulisanje pocetne forme svakog tima
for (let key in groups)
  groups[key].forEach((team) => {
    team.form = calculateInitialForm(
      team.ISOCode,
      team.FIBARanking,
      exibitions,
      teams
    );
  });

const groupFinalResults = [];
const order = [0, 5, 1, 4, 2, 3];
const groupName = ["A", "B", "C"];
const gamesPlayed = [];

//Dobijanje informacija o mecevima i ispisivanje utakmica u grupnoj fazi po kolima u svakoj grupi
for (let key in groups) {
  let res = [];
  res = simulateGroupMatches(groups[key], key);
  console.log(`Grupa ${key}`);
  let kolo = 1;
  for (let i = 0; i < 6; i += 2) {
    console.log(`\t${kolo}. Kolo`);
    console.log("\t\t" + res[1][order[i]]);
    console.log("\t\t" + res[1][order[i + 1]]);
    gamesPlayed.push(res[1][order[i]]);
    gamesPlayed.push(res[1][order[i + 1]]);
    kolo++;
  }
  groupFinalResults.push(res[0]);
}

//Ispisivanje konacnog plasmana timova u svim grupama
console.log("\n\nKonacan plasman u grupama:");
for (let j = 0; j < groupFinalResults.length; j++) {
  console.log(`\tGrupa ${groupName[j]}:`);
  groupFinalResults[j].forEach((team, i) => {
    console.log(
      `\t\t${i + 1}. ${team.Team}\t${team.wins} / ${team.losses} / ${
        team.points
      } / ${team.pointsScored} / ${team.pointsAgainst} / ${team.difference}`
    );
  });
}

//Sortiranje timpova
let teamRanking = [];
for (let i = 0; i < 3; i++) {
  let temp = [];
  for (let j = 0; j < groupFinalResults.length; j++) {
    temp.push(groupFinalResults[j][i]);
  }
  temp = setTeamOrder(temp);
  teamRanking = [...teamRanking, ...temp];
}
teamRanking.pop();

//Ispisivanje timova koji idu dalje
console.log("\nEkipe koje prolaze dalje se sledece:");
teamRanking.forEach((team, i) => {
  console.log(`\t${i + 1}. ${team.Team}`);
});

const sesiri = {
  D: [],
  E: [],
  F: [],
  G: [],
};

//Formiranje sesira
let sIndex = 0;
for (let key in sesiri) {
  sesiri[key].push(teamRanking[sIndex]);
  sesiri[key].push(teamRanking[sIndex + 1]);
  sIndex += 2;
}

//Ispisivanje sastava sesira
console.log("\nSesiri:");
for (let key in sesiri) {
  console.log(`\tSesir ${key}`);
  sesiri[key].forEach((team) => {
    console.log(`\t\t${team.Team}`);
  });
}

const quarters = {
  first: [[], []],
  second: [[], []],
};

//Uparivanje timova za cetvrt finale
if (
  !gamesPlayed.some((str) =>
    str.includes(sesiri["D"][0].Team + " - " + sesiri["G"][0].Team)
  ) &&
  !gamesPlayed.some((str) =>
    str.includes(sesiri["D"][1].Team + " - " + sesiri["G"][1].Team)
  )
) {
  quarters["first"][0].push(sesiri["D"][0], sesiri["G"][0]);
  quarters["first"][1].push(sesiri["D"][1], sesiri["G"][1]);
} else {
  quarters["first"][0].push(sesiri["D"][0], sesiri["G"][1]);
  quarters["first"][1].push(sesiri["D"][1], sesiri["G"][0]);
}

if (
  !gamesPlayed.some((str) =>
    str.includes(sesiri["E"][0].Team + " - " + sesiri["F"][0].Team)
  ) &&
  !gamesPlayed.some((str) =>
    str.includes(sesiri["E"][1].Team + " - " + sesiri["F"][1].Team)
  )
) {
  quarters["second"][0].push(sesiri["E"][0], sesiri["F"][0]);
  quarters["second"][1].push(sesiri["E"][1], sesiri["F"][1]);
} else {
  quarters["second"][0].push(sesiri["E"][0], sesiri["F"][1]);
  quarters["second"][1].push(sesiri["E"][1], sesiri["F"][0]);
}

const halfFinals = {
  first: [],
  second: [],
};

//Igranje utakmica cetvrt finala
console.log("\nCetvrtfinale:");
for (let key in quarters) {
  quarters[key].forEach((half, i) => {
    const result = simulateEliminationPhaseMatch(half[0], half[1]);
    halfFinals[key].push(result[0]);
    console.log(result[1]);
  });
}

const finals = [];
const thirdPlaceMatch = [];

//Igranje utakmica polufinala
console.log("\nPolufinale:");
for (let key in halfFinals) {
  const result = simulateEliminationPhaseMatch(
    halfFinals[key][0],
    halfFinals[key][1]
  );
  finals.push(result[0]);
  thirdPlaceMatch.push(result[2]);
  console.log(result[1]);
}

const ranking = [];
//Igranje utakmice za trece mesto
console.log("\nUtakmica za trece mesto:");
const tpRes = simulateEliminationPhaseMatch(
  thirdPlaceMatch[0],
  thirdPlaceMatch[1]
);
console.log(tpRes[1]);

//Igranje finala
console.log("\nFinale:");
const fRes = simulateEliminationPhaseMatch(finals[0], finals[1]);
console.log(fRes[1]);

ranking.push(fRes[0], fRes[2], tpRes[0]);

//Ispisivanje medalja
console.log("\nMedalje;");
ranking.forEach((team, i) => {
  console.log(`\t${i + 1}. ${team.Team}`);
});
