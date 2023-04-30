window.onload = function () {

	const playPile = document.querySelector("#play-pile");
	const cards = Array.from(playPile.querySelectorAll(".card"));

	cards.forEach((card) => {
		const angle = Math.floor(Math.random() * 360);
		card.style.setProperty("--angle", `${angle}deg`);
		card.classList.add("rotated");
	});

	const playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"];
	const numPlayersSelect = document.getElementById("numPlayers");
	const playerNamesContainer = document.getElementById("playernames-container");
	const playerLeftContainer = document.getElementById("playerleft-container");
	const playerTopContainer = document.getElementById("playertop-container");
	const playerRightContainer = document.getElementById("playerright-container");
	const playerBottomContainer = document.getElementById("playerbottom-container");

	let orderedContainers = [];

	function updatePlayerContainers(numPlayers) {
		playerLeftContainer.style.display = "none";
		playerTopContainer.style.display = "none";
		playerRightContainer.style.display = "none";
		playerBottomContainer.querySelector('.player-name').textContent = playerNames[0];
		orderedContainers = [];

		switch (numPlayers) {
			case "2":
				orderedContainers = [playerBottomContainer, playerTopContainer];
				playerTopContainer.style.display = "flex";
				break;
			case "3":
				orderedContainers = [playerBottomContainer, playerLeftContainer, playerRightContainer];
				playerLeftContainer.style.display = "flex";
				playerRightContainer.style.display = "flex";
				break;
			case "4":
				orderedContainers = [playerBottomContainer, playerLeftContainer, playerTopContainer, playerRightContainer];
				playerLeftContainer.style.display = "flex";
				playerTopContainer.style.display = "flex";
				playerRightContainer.style.display = "flex";
				break;
			default:
				console.error("Invalid number of players: " + numPlayers);
				break;
		}

		orderedContainers.forEach((container, index) => {
			container.querySelector('.player-name').textContent = playerNames[index];
		});

		for (let i = 0; i < numPlayers; i++) {
			const playerNameInput = document.createElement("input");
			playerNameInput.type = "text";
			playerNameInput.name = `player${i + 1}`;
			playerNameInput.placeholder = playerNames[i];
			playerNamesContainer.appendChild(playerNameInput);

			playerNameInput.addEventListener("input", function () {
				document.documentElement.style.setProperty(`--player-${i + 1}`, `"${playerNameInput.value}"`);
				updatePlayerName(i, playerNameInput.value);
			});
		}

		for (let i = numPlayers; i < orderedContainers.length; i++) {
			orderedContainers[i].querySelector('.player-name').textContent = '';
		}
	}

	function updatePlayerName(playerIndex, newName) {
		const playerVarName = `--player-${playerIndex+1}`;
		document.documentElement.style.setProperty(playerVarName, `"${newName}"`);
		orderedContainers[playerIndex].querySelector('.player-name').textContent = newName;
	}

	numPlayersSelect.addEventListener("change", function () {
		const numPlayers = this.value;
		updatePlayerContainers(numPlayers);

		while (playerNamesContainer.firstChild) {
			playerNamesContainer.removeChild(playerNamesContainer.firstChild);
		}

		for (let i = 0; i < numPlayers; i++) {
			const playerNameInput = document.createElement("input");
			playerNameInput.type = "text";
			playerNameInput.name = `player${i + 1}`;
			playerNameInput.placeholder = playerNames[i];
			playerNamesContainer.appendChild(playerNameInput);

			playerNameInput.addEventListener("input", function () {
				updatePlayerName(i, playerNameInput.value);
			});
		}
	});

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
