// base URL for the first call
var url = "https://www.dnd5eapi.co/api/classes";
var pickedClassURL; //`https://www.dnd5eapi.co/${}`;
var br = document.createElement("br");

window.onload = [fetchClassList(), chosenClass()];

// Makes the first API call for a list of player classes
function fetchClassList() {
    fetch(url).then(res => res.json()).then(res => {
        console.log(url);

        listHelper(res);
    })
}

// Generates class list as HTML elements
function listHelper(res) {
    var list = document.getElementById("classList");
    var listItem, text;

    for (var i = 0; i < res.results.length; i++) {

        text = res.results[i].name;

        listItem = document.createElement("li");
        listItem.setAttribute("id", `class${i}`);
        listItem.style.display = "inline-block";
        listItem.style.margin = "0px 0px 0px 2px";
        listItem.innerHTML = `<button class="classButton" id="class${i}" onClick="chosenClass('${res.results[i].url}'); clearLists()">` + text;

        listItem.appendChild(br);

        list.appendChild(listItem);
    }
}

// Gets info about a class from the given url
function chosenClass(pickedClass = "/api/classes/barbarian") {

    var url = `https://www.dnd5eapi.co${pickedClass}`;
    console.log(url);

    fetch(url).then(res => res.json()).then(res => {

        baseStats(res);

        if (url != "https://www.dnd5eapi.co/api/classes/monk") {
            document.getElementById("tools").style.display = "none";
            proficienciyBlock(res, url);
            getLevels(res.class_levels);
        }
        else {
            document.getElementById("tools").style.display = "inline-block";
            monkProfBlock(res)
        }
        console.log(res);
        document.getElementById("className").innerHTML = res.name;
    })
}

function getLevels(levelURL) {
    console.log(levelURL);

    fetch("https://www.dnd5eapi.co" + levelURL).then(res => res.json()).then(res => {

        var levelHeader, levelContent, prof_bonus, feature_choices, features;

        var levelBox = document.getElementById("levels");

        // Generates levels
        for (var i = 0; i < res.length; i++) {

            // null check
            prof_bonus = res[i].prof_bonus;
            if (prof_bonus == undefined) {
                prof_bonus = res[i - 1].prof_bonus;
            }

            levelHeader = document.createElement("h3");
            levelHeader.innerHTML = "Level: " + res[i].level;

            levelContent = document.createElement("li");
            levelContent.setAttribute("id", `profBonus${i}`);
            levelContent.innerHTML = "Profciency bonus: " + prof_bonus;

            // Generates API calls for all the class features to access the detailed descriptions
            for (var ii = 0; ii < res[i].features.length; ii++) {
                showFeature(res[i].features[ii].url, i);
            }

            levelBox.appendChild(levelHeader);
            levelBox.appendChild(levelContent);
        }
    })
}

function showFeature(url, i) {
    url = "https://www.dnd5eapi.co" + url;

    fetch(url).then(res => res.json()).then(res => {
        var container = document.getElementById(`profBonus${i}`);
        var features = document.createElement("li");
        features.innerHTML = res.name;
        for (var j = 0; j < res.desc.length; j++) {
            features.innerHTML += "<ul class='featureDesc'><li>" + res.desc[j] + "</li></ul>"
        }

        container.appendChild(features);
    })
}

function baseStats(pickedClass) {

    var header, healthDie, savingThrows;

    var stats = document.getElementById("stats");

    // Generates the header "base stats"
    header = document.createElement("h3");
    header.innerHTML = "Base Stats";
    stats.appendChild(header);

    // Generates list of hit die and saving throws
    healthDie = document.createElement("li");
    healthDie.innerHTML = "Hit Die: d" + pickedClass.hit_die;
    savingThrows = document.createElement("li");
    savingThrows.innerHTML = "Saving Throws: ";

    for (var i = 0; i < pickedClass.saving_throws.length; i++) {

        savingThrows.innerHTML += pickedClass.saving_throws[i].name + " ";

        stats.appendChild(savingThrows);
    }
    stats.appendChild(healthDie);
    stats.appendChild(br);
}

function proficienciyBlock(pickedClass) {

    var li, header;

    var skills = document.getElementById("stats");


    // Generates the header "proficiencies"
    header = document.createElement("h3");
    header.innerHTML = "Proficiencies: (" + pickedClass.proficiency_choices[0].choose + ")";
    skills.appendChild(header);

    // Generates list of skill proficiencies
    for (var i = 0; i < pickedClass.proficiency_choices[0].from.length; i++) {

        li = document.createElement("li");

        // All proficiencies comes with "skill: " so i use substr(7) to trim that off
        li.innerHTML = pickedClass.proficiency_choices[0].from[i].name.substr(7);

        skills.appendChild(li);
    }
}

// The API was wonky for monks - profeciency_choices[0] was tools and not skills for Monk only
function monkProfBlock(pickedClass) {

    var li, header, tools;

    var tools = document.getElementById("tools");
    var skills = document.getElementById("stats");

    // Generates the header "proficiencies"
    header = document.createElement("h3");
    header.innerHTML = "Proficiencies: (" + pickedClass.proficiency_choices[2].choose + ")";
    skills.appendChild(header);

    // Generates list of skill proficiencies
    for (var i = 0; i < pickedClass.proficiency_choices[2].from.length; i++) {

        li = document.createElement("li");
        li.innerHTML = pickedClass.proficiency_choices[2].from[i].name.substr(7);

        skills.appendChild(li);
    }

    // Generates the header "tools"
    header = document.createElement("h3");
    header.innerHTML = "Tools: (" + pickedClass.proficiency_choices[0].choose + ")";
    tools.appendChild(header);

    // Generates the list of tool proficiencies
    for (var i = 0; i < pickedClass.proficiency_choices[0].from.length; i++) {
        li = document.createElement("li");
        li.innerHTML = pickedClass.proficiency_choices[0].from[i].name;

        tools.appendChild(li);
    }
    getLevels("/api/classes/monk/levels");
}

// Clears the lists for next class search
function clearLists() {

    var stats = document.getElementById("stats");
    var tools = document.getElementById("tools");
    var levels = document.getElementById("levels");

    while (levels.firstChild) {
        levels.removeChild(levels.firstChild);
    }

    while (stats.firstChild) {
        stats.removeChild(stats.firstChild);
    };

    while (tools.firstChild) {
        tools.removeChild(tools.firstChild);
    };
}