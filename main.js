import calculateInitialForm from "./functions/InitalForms.js";
import simulateGroupMatches from "./functions/GroupStage.js";
import setTeamOrder from "./functions/SetOrder.js";
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
var teams = [];

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

let groupFinalResults = [];
let order = [0, 5, 1, 4, 2, 3];
let groupName = ["A", "B", "C"];

//Dobijanje informacija o mecevima i ispisivanje utakmica u grupnoj fazi po kolima u svakoj grupi
for (let key in groups) {
  let res = [];
  res = simulateGroupMatches(groups[key], key);
  console.log(`Grupa ${key}`);
  let kolo = 1;
  for (let i = 0; i < 6; i += 2) {
    console.log(`\t${kolo}. Kolo`);
    console.log("\t" + res[1][order[i]]);
    console.log("\t" + res[1][order[i + 1]]);
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

console.log("Ekipe koje prolaze dalje se sledece:");
teamRanking.forEach((team, i) => {
  console.log(`\t${i + 1}. ${team.Team}`);
});
