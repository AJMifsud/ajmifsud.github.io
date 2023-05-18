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

	const numPlayersSelect = document.getElementById("numPlayers");
	const playerNamesContainer = document.getElementById("playernames-container");
	const randomiseNamesButton = document.getElementById("randomise-names-button");
	const playerLeftContainer = document.getElementById("playerleft-container");
	const playerTopContainer = document.getElementById("playertop-container");
	const playerRightContainer = document.getElementById("playerright-container");
	const playerBottomContainer = document.getElementById("playerbottom-container");
	const openRulesButton = document.getElementById('open-rules');
	const closeRulesButton = document.getElementById('close-rules');
	const rulesContainer = document.getElementById('rules-container');
	const jokersCheck = document.querySelector('input[name="withJokers"]');
	const drawPile = document.getElementById('draw-pile');
	const drawpileCount = document.getElementById('drawpile-count');
	const burnPile = document.getElementById('burn-pile');
	const burnpileCount = document.getElementById('burnpile-count');
	let orderedContainers = [];
	const startButton = document.getElementById("startButton");
	const playPile = document.querySelector("#play-pile");
	let playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"];

	function assignNames (){
		playerNames = []
		const names = ["Andy", "Ashley", "Christie", "Jemma", "Toby", "Charlie", 
					"Stafford", "Matt", "Helena", "Natasha", "Edison", "Hannah",
					"Harry", "Adam"];
			while (playerNames.length < 4) {
			  const randomIndex = Math.floor(Math.random() * names.length);
			  const randomName = names[randomIndex];
			
			  if (!playerNames.includes(randomName)) {
				playerNames.push(randomName);
			  }
			}
		}

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

	closeRulesButton.addEventListener('click', function() {
		rulesContainer.style.display = 'none';
	  });

	openRulesButton.addEventListener('click', function() {
		rulesContainer.style.display = 'flex';
	  });

	randomiseNamesButton.addEventListener("click", function() {
		assignNames();
		numPlayers = numPlayersSelect.value;
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
			
			// Order the cards in the player's hand
			orderHand(player);
		}
	}

	function orderHand(player) {
		// Remove card elements from the hand container
		while (player.handContainer.firstChild) {
		  removeCard(player.handContainer.firstChild, player.handContainer);
		}
	  
		// Order the cards in the hand by rank
		player.hand.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));

	  
		// Add the card elements back to the hand container in the new order
		player.hand.forEach(card => {
		  createCardElement(card, player.handContainer);
		});
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
		gameLog.innerText += `\n${message}\n`;
		gameLog.scrollTop = gameLog.scrollHeight;
	}



	startButton.addEventListener("click", function () {

		// Get the number of players from the input field
		const numPlayers = parseInt(document.getElementById('numPlayers').value);
		const withJokersCheckbox = document.getElementsByName("withJokers")[0];
		const withJokers = withJokersCheckbox.checked ? "Yes" : "No";
		const players = [];
		const playedCards = [];
		const burntCards = [];
		const trickCards = ["2", "3", "7", "10"];
		let gameOver = false;
		createGameLog();

		//Create deck with/out jokers
		const deck = createDeck(withJokers);
		shuffleDeck(deck);

		// Clear cards from game container
		let cards = document.querySelectorAll('.card');
		cards.forEach(card => card.remove());

		// Function to update the draw pile card count display
		function updateDrawPileCount() {
			const numCards = deck.length;
			drawpileCount.textContent = `Cards in deck: ${numCards}`;
		}

		// Function to update the burnt pile card count display
		function updateBurnPileCount() {
			const numCards = burntCards.length;
			burnpileCount.textContent = `Cards burnt: ${numCards}`;
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

		updateDrawPileCount();
		updateBurnPileCount();

		async function playGame() {

			// Set the center card to the first card in the deck
			console.log("Deck size: " + deck.length)
			let centerCard = playedCards[playedCards.length - 1];
			let isSelectedValid = false;
			let isTrickCard = false;
			let currentPlayerIndex = 0;

			// Play the game until there is a winner
			while (!gameOver) {

				let selectedCard = undefined;
				isSelectedValid = false;
				const player = players[currentPlayerIndex];
				console.log(`${player.playerName}'s turn`);
				appendToGameLog(players[currentPlayerIndex].playerName + "'s turn");
				// Modify the border width and color
				player.container.style.borderWidth = '3px';   // Set the border width to 3 pixels
				player.container.style.borderColor = 'white';  // Set the border color to white
				

				console.log("Card to beat: ", centerCard);

				if (player.hand.length === 0 && player.faceUp.length === 0){
					appendToGameLog(players[currentPlayerIndex].playerName + " must select a face down card to reveal")
					// Allow the player to click on a card
					const selectedFaceDownCard = await faceDownCardClick();

					// Get the index of the selected card in the player's face down cards and remove it then replace it in the player's hand
					const selectedCardIndex = player.faceDown.indexOf(selectedFaceDownCard);
					player.faceDown.splice(selectedCardIndex, 1);
					player.hand.push(selectedFaceDownCard);
					// Remove the card element from the player's face down container and add it to the player hand container
					removeCard(selectedFaceDownCard.cardElement, player.faceDownContainer);
					createCardElement(selectedFaceDownCard.card, player.handContainer);
				}


				while (isSelectedValid == false) {
					// Allow the player to click on a card
					const selectedCardElement = await handCardClick();
					playTurn(player, selectedCardElement, centerCard);
				}

				// Assign the last played card to the center card
				centerCard = playedCards[playedCards.length - 1];

				orderHand(player);
				// Modify the border width and color
				player.container.style.borderWidth = '0px';   // Set the border width to 2 pixels
				player.container.style.borderColor = 'black';  // Set the border color to red

				if (
					playedCards.length >= 4 &&
					playedCards[playedCards.length - 1].rank === playedCards[playedCards.length - 2].rank &&
					playedCards[playedCards.length - 2].rank === playedCards[playedCards.length - 3].rank &&
					playedCards[playedCards.length - 3].rank === playedCards[playedCards.length - 4].rank
				  ) {
					appendToGameLog("Four of a kind detected! ")
					appendToGameLog(players[currentPlayerIndex].playerName + " can play again!")
					burnCards();
					currentPlayerIndex = currentPlayerIndex - 1;
				  }
				  
				// Check for empty hand to enable face-up cards
				if (player.hand.length === 0) {
						for (let i = 0; i < player.faceUp.length; i++) {
							// add card to the player's hand
							player.hand.push(player.faceUp[i]);
							createCardElement(player.faceUp[i], player.handContainer);
						}
						// clear the face up array
							player.faceUp.splice(0, player.faceUp.length);

						while (player.faceUpContainer.firstChild) {
							player.faceUpContainer.removeChild(player.faceUpContainer.firstChild);
						}
				}

				// Check for winner
				if (player.hand.length === 0 && player.faceUp.length === 0 && player.faceDown.length === 0) {
					gameOver = true;
					console.log(`${player.playerName} wins!`);
					appendToGameLog(players[currentPlayerIndex].playerName + " is the winner!")
					return;
				}

				// Move to the next player's turn
				currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;

				if (gameOver) {
					break;
				}

				
				
				function handCardClick() {
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

				function faceDownCardClick() {
					return new Promise(resolve => {
						const cardElements = player.faceDownContainer.querySelectorAll('.card');
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
					selectedCard = selectedCardElement.card;
					const selectedCardRank = ranks.indexOf(selectedCard.rank);

					console.log("Selected card: ", selectedCard);

					let canPlay = false;
					isTrickCard = false;

					if (trickCards.includes(selectedCard.rank)) {
						isTrickCard = true;
						canPlay = true;
					}

					if (centerCard) {
						if (centerCard.rank === "7") {
							player.hand.forEach(card => {
								if (ranks.indexOf(card.rank) > ranks.indexOf(centerCard.rank) & !isTrickCard) {
									canPlay = false;
									return;
								}
							});
							if (ranks.indexOf(selectedCard.rank) < ranks.indexOf(centerCard.rank)) {
								canPlay = true;
								isSelectedValid = true;
								playCard();
								if (isTrickCard === true) {
									handleTrickCards(selectedCard);
								}
								return;
							} else if (isTrickCard === true) {
								isSelectedValid = true;
								playCard();
								handleTrickCards(selectedCard)
								return;
							} else {
								// Log an error message to the console
								console.log("Selected card must be either below a 7 or a trick card.");
								appendToGameLog("Selected card must be either below a 7 or a trick card.");
								return;
							}
						} else {
							// Check if any of the cards in the player's hand have an equal rank to or a higher rank than the center card
							player.hand.forEach(card => {
								if (ranks.indexOf(card.rank) >= ranks.indexOf(centerCard.rank) || trickCards.includes(card.rank)) {
									canPlay = true;
								}
							});
							if (selectedCardRank >= ranks.indexOf(centerCard.rank) || trickCards.includes(selectedCard.rank)) {
								// If there is no center card or the selected card has an equal rank to or a higher rank than the center card:
								canPlay = true;
								isSelectedValid = true;
								playCard();
								if (isTrickCard === true) {
									handleTrickCards(selectedCard);
								}
								return;
							} else {
								// If the selected card is not higher than the center card:
								isSelectedValid = false;
								// Log an error message to the console
								console.log("Selected card must be a higher rank than the center card.");
	
								appendToGameLog("Selected card must be an equal to or higher in rank than the center card.");
							}
						}

					} else {
							canPlay = true;
							isSelectedValid = true;
							playCard();
							if (isTrickCard === true) {
								handleTrickCards(selectedCard);
							}
							return;
					}

					if (canPlay == false) {
						pickup(playedCards, player)
						isSelectedValid = true;
					}

					updateDrawPileCount();
					return;

					function playCard() {
						// Get the index of the selected card in the player's hand and remove it
						const selectedCardIndex = player.hand.indexOf(selectedCard);
						player.hand.splice(selectedCardIndex, 1);
						playedCards.push(selectedCard);

						// Log the played card to the game log
						appendToGameLog(players[currentPlayerIndex].playerName + " played " + selectedCard.rank + " of " + selectedCard.suit);

						// Remove the card element from the player's hand and add it to the play pile
						removeCard(selectedCardElement.cardElement, player.handContainer);
						createCardElement(selectedCard, playPile);

						// Rotate the played card to make it easier to see
						rotatePlayedCard(playPile.lastChild);

						centerCard = playedCards[playedCards.length - 1];

						if (deck.length > 0) {
							// If there are still cards in the deck:
							if (player.hand.length < 3) {
								// Draw a new card from the deck and add it to the player's hand
								const card = deck.pop();
								player.hand.push(card);

								// Add the new card to the player's hand on the screen
								createCardElement(card, player.handContainer);

								// Update the card count display
								updateDrawPileCount();

								// Remove the top card from the draw pile
								removeCard(drawPile.lastChild, drawPile);

								// Log the new deck size to the console
								console.log("Deck size: " + deck.length);
							}
						}
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
						appendToGameLog(players[currentPlayerIndex].playerName + " picked up the play pile!")
						centerCard = undefined;
					}	

				}

				function burnCards(playedcards) {
					// loop through each card in playedcards array
					for (let i = 0; i < playedcards.length; i++) {
						// add card to the player's hand
						burntCards.push(playedcards[i]);
						createCardElement(playedcards[i], burnPile);
						updateBurnPileCount();
					}
					// clear the playedcards array
					if (playedcards.length > 0) {
						playedcards.splice(0, playedcards.length);
					}
					while (playPile.firstChild) {
						playPile.removeChild(playPile.firstChild);
					}
				}

				function handleTrickCards(selectedCard) {
					switch (selectedCard.rank) {
						case "2":
							// Decrement the player counter before it is incremented again, ergo, player goes again
							appendToGameLog(players[currentPlayerIndex].playerName + " can play again")
							currentPlayerIndex = currentPlayerIndex - 1;
							centerCard = undefined;
							break;
						case "3":
							// Increment the player counter before it is incremented again, skipping the next player
							appendToGameLog(players[currentPlayerIndex].playerName + " skipped " + players[(currentPlayerIndex + 1) % numPlayers].playerName + "'s turn!")
							currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
							centerCard = undefined;
							break;
						case "10":
							burnCards(playedCards);
							appendToGameLog(players[currentPlayerIndex].playerName + " burnt the deck!")
							centerCard = undefined;
							break;
					}
				}
			}
		}

		playGame();


	});


}