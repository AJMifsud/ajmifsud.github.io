window.onload = function() {

const playPile = document.querySelector("#play-pile");
const cards = Array.from(playPile.querySelectorAll(".card"));

cards.forEach((card) => {
  const angle = Math.floor(Math.random() * 360);
  card.style.setProperty("--angle", `${angle}deg`);
  card.classList.add("rotated");
});

const numPlayersSelect = document.getElementById("numPlayers");
const playerNamesContainer = document.getElementById("playernames-container");
const playerLeftContainer = document.getElementById("playerleft-container");
const playerTopContainer = document.getElementById("playertop-container");
const playerRightContainer = document.getElementById("playerright-container");

function updatePlayerContainers(numPlayers) {
  playerLeftContainer.style.display = "none";
  playerTopContainer.style.display = "none";
  playerRightContainer.style.display = "none";

  switch (numPlayers) {
    case "2":
      playerTopContainer.style.display = "flex";
      break;
    case "3":
      playerLeftContainer.style.display = "flex";
      playerRightContainer.style.display = "flex";
      break;
    case "4":
      playerLeftContainer.style.display = "flex";
      playerTopContainer.style.display = "flex";
      playerRightContainer.style.display = "flex";
      break;
    default:
      console.error("Invalid number of players: " + numPlayers);
      break;
  }
}

numPlayersSelect.addEventListener("change", function () {
  const numPlayers = this.value;
  updatePlayerContainers(numPlayers);
});

while (playerNamesContainer.firstChild) {
  playerNamesContainer.removeChild(playerNamesContainer.firstChild);
}

for (let i = 0; i < numPlayersSelect.value; i++) {
  const playerNameInput = document.createElement("input");
  playerNameInput.type = "text";
  playerNameInput.name = `player${i + 1}`;
  playerNameInput.placeholder = `Player ${i + 1} Name`;
  playerNamesContainer.appendChild(playerNameInput);
}

updatePlayerContainers(numPlayersSelect.value);

}
