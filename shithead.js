window.onload = function () {

	//-----------//
	//PAGE LAYOUT//
	//-----------//

	function rotatePlayedCard(card) {
		if (playPile.contains(card)) {
			const angle = Math.floor(Math.random() * 360);
			card.style.setProperty("--angle", `${angle}deg`);
			card.classList.add("rotated");
		}
	}

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
	let orderedContainers = [];
	const startButton = document.getElementById("startButton");
	const playPile = document.querySelector("#play-pile");

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

	function createGameLog() {
		// Get a reference to the sidebar element
		const sidebar = document.getElementById('sidebar');

		// Remove any existing game log element
		let gameLog = document.getElementById('game-log');
		if (gameLog) {
			sidebar.removeChild(gameLog);
		}

		// Create a new div element for the game log
		gameLog = document.createElement('div');
		gameLog.id = 'game-log';
		gameLog.innerText = '### Game Log ###';
		gameLog.innerText += '\nNew Game\n';

		// Append the new console log element to the sidebar
		sidebar.appendChild(gameLog);
	}

	function appendToGameLog(message) {
		// Get a reference to the game log element
		const gameLog = document.getElementById('game-log');


		// Append the message to the game log
		gameLog.innerText += `\n${message}`;
		gameLog.scrollTop = gameLog.scrollHeight;
	}

	function pickup(playedcards, player) {
		// loop through each card in playedcards array
		for (let i = 0; i < playedcards.length; i++) {
		  // add card to the player's hand
		  player.hand.push(playedcards[i]);
		  createCardElement(playedcards[i], player.handContainer);
		}
		// clear the playedcards array
		if (playedcards.length > 0) {
		  playedcards.splice(0, playedcards.length);
		}		
		while (playPile.firstChild) {
		  playPile.removeChild(playPile.firstChild);
		}
	  }
	  
	  

	startButton.addEventListener("click", function () {

		// Get the number of players from the input field
		const numPlayers = parseInt(document.getElementById('numPlayers').value);
		const withJokersCheckbox = document.getElementsByName("withJokers")[0];
		const withJokers = withJokersCheckbox.checked ? "Yes" : "No";
		const players = [];
		const playedCards = [];
		let gameOver = false;
		createGameLog();

		//Create deck with/out jokers
		const deck = createDeck(withJokers);
		shuffleDeck(deck);

		// Clear cards from game container
		let cards = document.querySelectorAll('.card');
		cards.forEach(card => card.remove());

		// Function to update the card count display
		function updateCardCount() {
			//const numCards = drawPile.querySelectorAll('.card').length;
			const numCards = deck.length;
			cardCount.textContent = `Cards in deck: ${numCards}`;
		}

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
			let centerCard = playedCards[playedCards.length - 1];
			let isSelectedValid = false;

			// Play the game until there is a winner
			while (!gameOver) {
				// Loop through each player and allow them to play a card
				for (let i = 0; i < numPlayers; i++) {
					isSelectedValid = false;
					const player = players[i];
					console.log(`${player.playerName}'s turn`);
					appendToGameLog(players[i].playerName + "'s turn");

					
					console.log("Last played card: ", centerCard);
					function cardClick() {
						return new Promise(resolve => {
							const cardElements = player.handContainer.querySelectorAll('.card');
							cardElements.forEach(cardElem => {
								cardElem.addEventListener('click', () => {
									resolve({
										cardElement: cardElem,
										card: cardElem.card
									});
								});
							});
						});
					}

					async function playTurn(player, selectedCardElement, centerCard) {
						const selectedCard = selectedCardElement.card;
						const selectedCardRank = ranks.indexOf(selectedCard.rank);

						console.log("Selected card: ", selectedCard);

						let canPlay = false;

						if (centerCard) {
							// Check if any of the cards in the player's hand have a higher rank than the center card
							player.hand.forEach(card => {
							  if (selectedCardRank >= ranks.indexOf(centerCard.rank)) {
								canPlay = true;
							  }
							});
						  }

						if (!centerCard){
							canPlay = true;
						}	

						if (canPlay == false){
							pickup(playedCards, player)
							appendToGameLog(players[i].playerName + " picked up the play pile!")
							return;
						}	

						if (!centerCard || selectedCardRank >= ranks.indexOf(centerCard.rank)) {
							// If there is no center card or the selected card has a higher rank than the center card:
							canPlay = true;
							isSelectedValid = true;
							// Get the index of the selected card in the player's hand and remove it
							const selectedCardIndex = player.hand.indexOf(selectedCard);
							player.hand.splice(selectedCardIndex, 1);
							playedCards.push(selectedCard);

							// Log the played card to the game log
							appendToGameLog(players[i].playerName + " played " + selectedCard.rank + " of " + selectedCard.suit);

							// Remove the card element from the player's hand and add it to the play pile
							removeCard(selectedCardElement.cardElement, player.handContainer);
							createCardElement(selectedCard, playPile);

							// Rotate the played card to make it easier to see
							rotatePlayedCard(playPile.lastChild);
							
							centerCard = playedCards[playedCards.length - 1];

							if (deck.length > 0) {
								// If there are still cards in the deck:

								// Draw a new card from the deck and add it to the player's hand
								const card = deck.pop();
								player.hand.push(card);

								// Add the new card to the player's hand on the screen
								createCardElement(card, player.handContainer);

								// Update the card count display
								updateCardCount();

								// Remove the top card from the draw pile
								removeCard(drawPile.lastChild, drawPile);

								// Log the new deck size to the console
								console.log("Deck size: " + deck.length);
							}
						} else {
							// If the selected card is not higher than the center card:
							isSelectedValid = false;
							// Log an error message to the console
							console.log("Selected card must be a higher rank than the center card.");

							appendToGameLog("Selected card must be an equal to or higher in rank than the center card.");
							

							// Exit the function without doing anything else
							return;
						}

						if (player.hand.length === 0) {
							gameOver = true;
							console.log(`${player.playerName} wins!`);
							return;
						}

						updateCardCount();
					}

					while (isSelectedValid == false){
						// Allow the player to click on a card
						const selectedCardElement = await cardClick();
						playTurn(player, selectedCardElement, centerCard);
					}


					
					if (gameOver) {
						break;
					}

					centerCard = playedCards[playedCards.length - 1];

				}
			}
		}

		playGame();


	});


}