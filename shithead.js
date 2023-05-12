window.onload = function () {

	//-----------//
	//PAGE LAYOUT//
	//-----------//

	const playPile = document.querySelector("#play-pile");
	let playedCards = Array.from(playPile.querySelectorAll(".card"));

	playedCards.forEach((card) => {
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
	const jokersCheck = document.querySelector('input[name="withJokers"]');
	const drawPile = document.getElementById('draw-pile');
	const cardCount = document.getElementById('card-count');
	let withJokers = false;
	let orderedContainers = [];
	const startButton = document.getElementById("startButton");

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
		playerNames[playerIndex] = newName;
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
			playerNameInput.placeholder = `Player ${i + 1}`;
			playerNameInput.value = playerNames[i];
			playerNamesContainer.appendChild(playerNameInput);

			playerNameInput.addEventListener("input", function () {
				updatePlayerName(i, playerNameInput.value);
			});
		}

	});

	updatePlayerContainers(numPlayersSelect.value);

	jokersCheck.addEventListener('change', function () {
		if (this.checked) {
			withJokers = true;
		} else {
			withJokers = false;
		}
	});

	// Function to update the card count display
	function updateCardCount() {
		const numCards = drawPile.querySelectorAll('.card').length;
		cardCount.textContent = `Cards in deck: ${numCards}`;
	}

	// Use a MutationObserver to detect changes to the drawPile container
	const observer = new MutationObserver(function (mutationsList, observer) {
		for (let mutation of mutationsList) {
			if (mutation.type === 'childList') {
				updateCardCount();
			}
		}
	});
	observer.observe(drawPile, {
		childList: true
	});


	//----------//
	//GAME LOGIC//
	//----------//

	// Define the necessary variables and arrays
	const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
	const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

	// Define the Player class
	class Player {
		constructor(playerName, hand, faceDown, faceUp) {
			this.name = playerName;
			this.hand = hand;
			this.faceDown = faceDown;
			this.faceUp = faceUp;
			this.container = null;
			this.playerName = null;
			this.handContainer = null;
			this.faceUpContainer = null;
			this.faceDownContainer = null;
		}
	}

	// Define the Deck class
	class Deck {
		constructor(withJokers) {
			this.cards = [];
		}
	}

	function createDeck(withJokers) {
		const deck = [];

		for (let suit of suits) {
			for (let rank of ranks) {
				const card = {
					suit,
					rank,
					frontImage: `images/cards/${rank}_of_${suit}.png`,
					backImage: "images/cards/card_back.png"
				};
				deck.push(card);
			}
		}

		if (withJokers === "Yes") {
			deck.push({
				rank: "joker",
				frontImage: "images/cards/black_joker.png"
			});
			deck.push({
				rank: "joker",
				frontImage: "images/cards/red_joker.png"
			});
		}

		return deck;
	}

	function shuffleDeck(deck) {
		for (let i = deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
	}

	function createCardElement(card, targetElement) {
		const cardElement = document.createElement("div");
		cardElement.classList.add("card");

		const cardFrontElement = document.createElement("div");
		cardFrontElement.classList.add("card-front");
		cardFrontElement.style.backgroundImage = `url(${card.frontImage})`;

		const cardBackElement = document.createElement("div");
		cardBackElement.classList.add("card-back");

		cardElement.appendChild(cardFrontElement);
		cardElement.appendChild(cardBackElement);

		targetElement.appendChild(cardElement);


		// Add a reference to the underlying card value
		cardElement.card = card;

		return cardElement;
	}


	function removeCard(cardElement, container) {
		console.log("cardElement:", cardElement);
		console.log("container:", container);
		container.removeChild(cardElement);
	}


	function isCardValid(selectedCard, centerCard) {
		const rankOrder = ranks.indexOf(selectedCard.rank);
		const centerRankOrder = ranks.indexOf(centerCard.rank);

		return rankOrder >= centerRankOrder;
	}

	function dealCards(deck, players) {
		for (let i = 0; i < players.length; i++) {
			const player = players[i];

			// Deal three cards to each player's face-down-cards container
			for (let j = 0; j < 3; j++) {
				const card = deck.pop();
				player.faceDown.push(card);
				createCardElement(card, player.faceDownContainer);
			}

			// Deal three cards to each player's face-up-cards container
			for (let j = 0; j < 3; j++) {
				const card = deck.pop();
				player.faceUp.push(card);
				createCardElement(card, player.faceUpContainer);
			}

			// Deal three cards to each player's playable-cards container
			for (let j = 0; j < 3; j++) {
				const card = deck.pop();
				player.hand.push(card);
				createCardElement(card, player.handContainer);
			}
		}
	}

	startButton.addEventListener("click", function () {
		// Get the number of players from the input field
		const numPlayers = parseInt(document.getElementById('numPlayers').value);
		const withJokersCheckbox = document.getElementsByName("withJokers")[0];
		const withJokers = withJokersCheckbox.checked ? "Yes" : "No";
		const players = [];
		let gameOver = false;
		//Create deck with/out jokers
		const deck = createDeck(withJokers);
		shuffleDeck(deck);
		// Clear cards from game container
		let cards = document.querySelectorAll('.card');
		cards.forEach(card => card.remove());


		// Create the player objects and add them to the players array
		for (let i = 0; i < numPlayers; i++) {
			// Get the player container element for this player index
			const playerContainer = orderedContainers[i];

			// Get the containers for the different types of cards for this player
			const playerName = playerContainer.querySelector(".player-name");
			const handContainer = playerContainer.querySelector(".playable-cards");
			const faceUpContainer = playerContainer.querySelector(".face-up-cards");
			const faceDownContainer = playerContainer.querySelector(".face-down-cards");

			// Create a new player object with empty arrays for each type of card
			const player = new Player(playerName, [], [], []);

			// Set the player object's properties to reference the container elements
			player.container = playerContainer;
			player.playerName = playerName.textContent;
			player.handContainer = handContainer;
			player.faceUpContainer = faceUpContainer;
			player.faceDownContainer = faceDownContainer;

			players.push(player);
		}

		// Deal cards to players
		dealCards(deck, players);

		// Log player names to console
		for (let i = 0; i < numPlayers; i++) {
			console.log(`Player ${i + 1}: ${players[i].playerName}`);
		}

		// Clear the draw pile
		while (drawPile.firstChild) {
			drawPile.removeChild(drawPile.firstChild);
		}

		// Add the remainder of cards to the draw pile
		for (let card of deck) {
			const cardElement = createCardElement(card, drawPile);
			drawPile.appendChild(cardElement);
		}
		updateCardCount();


		async function playGame() {

			// Set the center card to the first card in the deck
			console.log("Deck size: " + deck.length)
			const centerCard = deck.pop();
			const drawpileTopCard = drawPile.lastChild;
			createCardElement(centerCard, playPile)
			removeCard(drawpileTopCard, drawPile);
			updateCardCount();
			console.log("Deck size: " + deck.length)


			// Play the game until there is a winner
			while (!gameOver) {
				// Loop through each player and allow them to play a card
				for (let i = 0; i < numPlayers; i++) {
					const player = players[i];
					console.log(`${player.playerName}'s turn`);

					function cardClick() {
						return new Promise(resolve => {
						  const cardElements = player.handContainer.querySelectorAll('.card');
						  cardElements.forEach(cardElem => {
							cardElem.addEventListener('click', () => {
							  resolve({ cardElement: cardElem, card: cardElem.card });
							});
						  });
						});
					  }						
				
					  async function playTurn(player, selectedCardElement, centerCard) {
					  
						// Get the selected card from the player's hand
						const selectedCard = selectedCardElement.card;
					  
						// Remove the selected card from the player's hand
						player.hand.splice(selectedCard);
					  
						// Remove the selected card element from the player's hand container
						removeCard(selectedCardElement.cardElement, player.handContainer);
					  
						// Add the selected card to the play pile
						createCardElement(selectedCard, playPile);
					  
						// Check if the player has won the game
						if (player.hand.length === 0) {
						  gameOver = true;
						  console.log(`${player.playerName} wins!`);
						  return;
						}
					  
						// Update the center card
						centerCard.value = selectedCard.value;
						centerCard.suit = selectedCard.suit;
						updateCardElement(centerCard, playPile.lastChild);
					  
						// Update the card count and go to the next turn
						updateCardCount();
					  }
					  

					// Allow the player to click on a card
					const selectedCardElement = await cardClick();
					playTurn(player, selectedCardElement, centerCard);


					if (gameOver) {
						break;
					}
				}
			}
		}
		playGame();


	});


}