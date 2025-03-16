let participants = [];

// Charger les participants depuis le fichier JSON
async function loadParticipants() {
    try {
        const response = await fetch("participants.json");
        participants = await response.json();
        updateParticipantList();
    } catch (error) {
        console.error("Erreur lors du chargement du fichier JSON :", error);
    }
}

function addParticipant() {
    const name = document.getElementById("participant-name").value;
    const level = parseInt(document.getElementById("participant-level").value);
    if (name.trim() === "") return;

    participants.push({ name, level });
    document.getElementById("participant-name").value = "";
    updateParticipantList();
    saveParticipants();  // Sauvegarde après ajout
}

function updateParticipantList() {
    const list = document.getElementById("participant-list");
    list.innerHTML = "";
    participants.forEach(p => {
        list.innerHTML += `<li class='list-group-item'>${p.name} (Niveau ${p.level})</li>`;
    });
}

async function saveParticipants() {
    try {
        await fetch("save.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(participants),
        });
    } catch (error) {
        console.error("Erreur lors de la sauvegarde :", error);
    }
}

document.addEventListener("DOMContentLoaded", loadParticipants);

function generateTeams() {
    console.log("Bouton cliqué !");
    console.log("Participants avant génération :", participants);

    const selectedSize = parseInt(document.getElementById("team-size").value);
    console.log("Taille des équipes sélectionnée :", selectedSize);

    if (!selectedSize || selectedSize < 2) {
        console.error("Erreur : Taille d'équipe invalide !");
        return;
    }

    let numTeams = Math.ceil(participants.length / selectedSize);
    let teams = Array.from({ length: numTeams }, () => []);

    let sortedParticipants = [...participants].sort((a, b) => b.level - a.level);
    let index = 0;
    let reverse = false;

    while (sortedParticipants.length > 0) {
        if (!reverse) {
            for (let i = 0; i < numTeams && sortedParticipants.length > 0; i++) {
                teams[i].push(sortedParticipants.shift());
            }
        } else {
            for (let i = numTeams - 1; i >= 0 && sortedParticipants.length > 0; i--) {
                teams[i].push(sortedParticipants.shift());
            }
        }
        reverse = !reverse;
    }

    console.log("Équipes générées :", teams);
    displayTeams(teams);
}

function displayTeams(teams) {
    const teamsContainer = document.getElementById("teams-container");
    teamsContainer.innerHTML = "";

    teams.forEach((team, index) => {
        let teamHTML = `<div class="card mt-3">
            <div class="card-header bg-primary text-white">Équipe ${index + 1}</div>
            <ul class="list-group list-group-flush">`;

        team.forEach(member => {
            teamHTML += `<li class="list-group-item">${member.name} (Niveau ${member.level})</li>`;
        });

        teamHTML += "</ul></div>";
        teamsContainer.innerHTML += teamHTML;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generate-teams").addEventListener("click", generateTeams);
});
