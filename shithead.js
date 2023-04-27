window.onload = function () {

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
	const playerBottomContainer = document.getElementById("playerbottom-container");

	function updatePlayerContainers(numPlayers) {
		playerLeftContainer.style.display = "none";
		playerTopContainer.style.display = "none";
		playerRightContainer.style.display = "none";

		switch (numPlayers) {
			case "2":
				playerTopContainer.style.display = "flex";
				playerTopContainer.querySelector('.player-name').textContent = getComputedStyle(document.documentElement).getPropertyValue('--player-names-1');
				break;
			case "3":
				playerLeftContainer.style.display = "flex";
				playerRightContainer.style.display = "flex";
				playerRightContainer.querySelector('.player-name').textContent = getComputedStyle(document.documentElement).getPropertyValue('--player-names-2');
				break;
			case "4":
				playerLeftContainer.style.display = "flex";
				playerLeftContainer.querySelector('.player-name').textContent = getComputedStyle(document.documentElement).getPropertyValue('--player-names-1');
				playerTopContainer.style.display = "flex";
				playerTopContainer.querySelector('.player-name').textContent = getComputedStyle(document.documentElement).getPropertyValue('--player-names-2');
				playerRightContainer.style.display = "flex";
				playerRightContainer.querySelector('.player-name').textContent = getComputedStyle(document.documentElement).getPropertyValue('--player-names-3');
				break;
			default:
				console.error("Invalid number of players: " + numPlayers);
				break;
		}
	}

	numPlayersSelect.addEventListener("change", function () {
		const numPlayers = this.value;
		updatePlayerContainers(numPlayers);

		while (playerNamesContainer.firstChild) {
			playerNamesContainer.removeChild(playerNamesContainer.firstChild);
		}

		for (let i = 0; i < numPlayersSelect.value; i++) {
			const playerNameInput = document.createElement("input");
			playerNameInput.type = "text";
			playerNameInput.name = `player${i + 1}`;
			playerNameInput.placeholder = `Player ${i + 1} Name`;
			playerNamesContainer.appendChild(playerNameInput);

			// Add an event listener to update the CSS variable when the input value changes
			playerNameInput.addEventListener("input", function () {
				document.documentElement.style.setProperty(`--player-names-${i}`, playerNameInput.value);
			});
		}
	});

	// Set the default values of the CSS variables
	document.documentElement.style.setProperty('--player-names-0', 'Player 1');
	document.documentElement.style.setProperty('--player-names-1', 'Player 2');
	document.documentElement.style.setProperty('--player-names-2', 'Player 3');
	document.documentElement.style.setProperty('--player-names-3', 'Player 4');

	updatePlayerContainers(numPlayersSelect.value);


	function createDeck() {
		const suits = ["hearts", "diamonds", "clubs", "spades"];
		const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
		const deck = [];
		let withJokers = "";
		switch (withJokers) {
			case "No":
				// create cards without jokers
				for (let suit of suits) {
					for (let value of values) {
						deck.push({
							value,
							suit
						});
					}
				}
				break;
			case "Yes":
				// create jokers
				for (let i = 0; i < 2; i++) {
					deck.push({
						value: "Joker",
						suit: "joker"
					});
				}
				break;
		}
		return deck;
	}

}
