import calculateInitialForm from "./functions/InitalForms.js";
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

console.log(Math.floor(Math.random() * (87 - 50)) + 50);
