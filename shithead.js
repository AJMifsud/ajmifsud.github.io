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
	const dealButton = document.getElementById("deal-button");
	const startButton = document.getElementById("start-button");
	const playPile = document.getElementById('play-pile');
	const playpileCount = document.getElementById('playpile-count');
	let playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"];

	function assignNames() {
		playerNames = []
		const names = ["Andy", "Ashley", "Christie", "Jemma", "Toby", "Charlie",
			"Stafford", "Matt", "Helena", "Natasha", "Edison", "Hannah",
			"Harry", "Adam", "Marin", "Bertie", "Jack", "Ella"
		];
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
			withJokers = "Yes";
		} else {
			withJokers = "No";
		}
	});

	closeRulesButton.addEventListener('click', function () {
		rulesContainer.style.display = 'none';
	});

	openRulesButton.addEventListener('click', function () {
		rulesContainer.style.display = 'flex';
	});

	randomiseNamesButton.addEventListener("click", function () {
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
	const withJokersCheckbox = document.getElementsByName("withJokers");
	let withJokers = withJokersCheckbox.checked ? "Yes" : "No";
	let deck = [];
	let numPlayers = numPlayersSelect.value;
	let players = [];
	let playedCards = [];
	let burntCards = [];
	const trickCards = ["2", "3", "7", "10"];
	let gameOver = false;
	let currentPlayerIndex = 0;
	let centerCard = undefined;
	let selectedCardElements = [];
	let selectedCards = []
	let isSelectedValid = false;
	let isTrickCard = false;
	let matchFour = false


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

	// Function to update the play pile card count display
	function updatePlayPileCount() {
		const numCards = playedCards.length;
		playpileCount.textContent = `Cards in play pile : ${numCards}`;
	}

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

	function initialiseGame() {
		deck = [];
		numPlayers = numPlayersSelect.value;
		playedCards = [];
		burntCards = [];
		players = [];


		// Get the number of players from the input field
		numPlayers = parseInt(document.getElementById('numPlayers').value);
		createGameLog();

		//Create deck with/out jokers
		deck = createDeck(withJokers);
		shuffleDeck(deck);

		// Clear cards from game container
		let cards = document.querySelectorAll('.card');
		cards.forEach(card => card.remove());
		updateDrawPileCount();
		updateBurnPileCount();
		updatePlayPileCount();

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

			// Modify the border width and color
			player.container.style.borderWidth = '0px'; // Set the border width to 2 pixels
			player.container.style.borderColor = 'black'; // Set the border color to red

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

		// Update the card count display
		updateDrawPileCount();

		switchCardLoop(players[0]);
	}

	async function playTurn(player, centerCard) {

		function playCards() {
			let i = 0;
			selectedCards.forEach(card => {
				const selectedCardHandIndex = player.hand.indexOf(card);
				player.hand.splice(selectedCardHandIndex, 1);
				const selectedCardIndex = selectedCards.indexOf(card);
				//selectedCards.splice(selectedCardIndex, 1);
				playedCards.push(card);
				appendToGameLog(players[currentPlayerIndex].playerName + " played " + card.rank + " of " + card.suit);
				removeCard(selectedCardElements[i].cardElement, player.handContainer);
				createCardElement(card, playPile);
				rotatePlayedCard(playPile.lastChild);
				if (card.rank === "3") {
					skipCount++;
				}
				i++;
			});
			centerCard = playedCards[playedCards.length - 1];
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

		if (player.hand.length === 0 && player.faceUp.length === 0) {
			appendToGameLog(players[currentPlayerIndex].playerName + " must select a face down card to reveal")
			// Allow the player to click on a card
			const selectedFaceDownCard = await faceDownCardClick(player);
			// Get the index of the selected card in the player's face down cards and remove it then replace it in the player's hand
			const selectedCardIndex = player.faceDown.indexOf(selectedFaceDownCard);
			player.faceDown.splice(selectedCardIndex, 1);
			player.hand.push(selectedFaceDownCard.card);
			// Remove the card element from the player's face down container and add it to the player hand container
			removeCard(selectedFaceDownCard.cardElement, player.faceDownContainer);
			createCardElement(selectedFaceDownCard.card, player.handContainer);
		}

		selectedCards = []
		selectedCardElements = []

		// Allow the player to click on a card
		let firstSelectedCard = await firstCardClick(player);
		console.log("Selected card: ", firstSelectedCard.card);
		selectedCardElements.push(firstSelectedCard)
		selectedCards.push(firstSelectedCard.card);
		let selectedCard = selectedCardElements[0].card;
		const selectedCardRank = ranks.indexOf(selectedCard.rank);
		const remainingCards = player.hand.filter(card => card !== selectedCard);
		const hasEqualRank = remainingCards.some(card => card.rank === selectedCard.rank);

		skipCount = 0;
		matchFour = false;
		let canPlay = false;
		isTrickCard = false;

		// Select next card if duplicate rank is in hand
		if (hasEqualRank) {
			appendToGameLog("Another card in your hand has the same rank as the selected card.");

			while (true) {
				let nextCardElement = await firstCardClick(player);

				// If the next selected card is the same rank as the first selected
				if (nextCardElement.card.rank === selectedCard.rank) {
					// If the card has not already been selected
					if (!selectedCards.includes(nextCardElement.card)) {
						selectedCardElements.push(nextCardElement);
						selectedCards.push(nextCardElement.card);
					} else {
						appendToGameLog("You have already selected this card.");
						break; // Exit the loop if the player selects a card they have already chosen
					}
				} else {
					appendToGameLog("Next selected card must be the same rank as the first selected card.");
					break; // Exit the loop if the player selects a card with a different rank
				}

				// Exit the loop if all cards with the same rank have been selected
				if (selectedCards.filter(card => card.rank === selectedCard.rank).length === remainingCards.length) {
					break;
				}
			}
		}


		if (trickCards.includes(selectedCard.rank)) {
			isTrickCard = true;
			canPlay = true;
		}

		if (centerCard) {
			// If there is a center card:
			canPlay = false;
			// Set the variable canPlay to false by default.

			if (centerCard.rank === "7") {
				// If the center card's rank is "7":

				// Check each card in the player's hand:
				player.hand.forEach(card => {
					if (ranks.indexOf(card.rank) < ranks.indexOf(centerCard.rank) && !isTrickCard) {
						// If the rank of the card is lower than the center card's rank
						// and it is not a trick card:
						canPlay = true;
						// Set canPlay to true.
					}
				});

				if (ranks.indexOf(selectedCard.rank) < ranks.indexOf(centerCard.rank) || isTrickCard) {
					// If the rank of the selected card is lower than the center card's rank
					// or it is a trick card:
					canPlay = true;
					// Set canPlay to true.
					isSelectedValid = true;
					// Set isSelectedValid to true.
				} else {
					console.log("Selected card must be either below a 7 or a trick card.");
					// Log an error message to the console.
					appendToGameLog("Selected card must be either below a 7 or a trick card.");
					// Append an error message to the game log.
				}
			} else {
				// If the center card's rank is not "7":

				// Check each card in the player's hand:
				player.hand.forEach(card => {
					if (ranks.indexOf(card.rank) >= ranks.indexOf(centerCard.rank) || trickCards.includes(card.rank)) {
						// If the rank of the card is equal to or higher than the center card's rank
						// or it is a trick card:
						canPlay = true;
						// Set canPlay to true.
					}
				});

				if (selectedCardRank >= ranks.indexOf(centerCard.rank) || trickCards.includes(selectedCard.rank)) {
					// If the rank of the selected card is equal to or higher than the center card's rank
					// or it is a trick card:
					canPlay = true;
					// Set canPlay to true.
					isSelectedValid = true;
					// Set isSelectedValid to true.
				} else {
					isSelectedValid = false;
					// Set isSelectedValid to false.
					console.log("Selected card must be a higher rank than the center card.");
					// Log an error message to the console.
					appendToGameLog("Selected card must be an equal to or higher in rank than the center card.");
					// Append an error message to the game log.
				}
			}
		} else {
			// If there is no center card:
			canPlay = true;
			// Set canPlay to true.
			isSelectedValid = true;
			// Set isSelectedValid to true.
		}

		if (canPlay && isSelectedValid) {
			playCards();
			// Update the number of played cards
			updatePlayPileCount();
		}

		// Pickup on unplayable hand
		if (canPlay == false) {
			pickup(playedCards, player)
			isSelectedValid = true;
		}

		// Draw cards up to 3 in hand
		// If there are still cards in the deck:
		if (deck.length > 0) {
			while (player.hand.length < 3) {
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
		orderHand(player);

		
		return;
	}

	function burnCards(playedCards) {
		// loop through each card in playedcards array
		for (let i = 0; i < playedCards.length; i++) {
			// add card to the player's hand
			burntCards.push(playedCards[i]);
			createCardElement(playedCards[i], burnPile);
			updateBurnPileCount();
		}
		// clear the playedcards array
		if (playedCards.length > 0) {
			playedCards.splice(0, playedCards.length);
		}
		while (playPile.firstChild) {
			playPile.removeChild(playPile.firstChild);
		}
	}

	function handleTrickCards() {
		switch (selectedCards[0].rank) {
			case "2":
				appendToGameLog(players[currentPlayerIndex].playerName + " can play again")
				centerCard = undefined;
				break;
			case "3":
				appendToGameLog(players[currentPlayerIndex].playerName + " skipped " + players[(currentPlayerIndex + 1) % numPlayers].playerName + "'s turn!")
				currentPlayerIndex = (currentPlayerIndex + (skipCount + 1)) % numPlayers;
				centerCard = undefined;
				break;
			case "7":
				// Increment the player counter before it is incremented again, skipping the next player
				appendToGameLog(players[(currentPlayerIndex + 1) % numPlayers].playerName + " must now either play below a 7 or a trick card!")
				currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
				break;
			case "10":
				burnCards(playedCards);
				appendToGameLog(players[currentPlayerIndex].playerName + " burnt the deck!")
				currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
				centerCard = undefined;
				break;
		}
	}

	async function firstCardClick(player) {
		return new Promise(resolve => {
			const cardElements = player.handContainer.querySelectorAll('.card');

			function handleClick(event) {
				const cardElem = event.currentTarget;
				const card = cardElem.card;
				cardElem.style.transform = "scale(1.15) translateY(-7px)";

				// Remove the event listener
				cardElements.forEach(cardElem => {
					cardElem.removeEventListener('click', handleClick);
				});

				resolve({
					cardElement: cardElem,
					card: card
				});
			}

			cardElements.forEach(cardElem => {
				cardElem.addEventListener('click', handleClick);
			});
		});
	}

	function faceUpCardClick(player) {
		return new Promise(resolve => {
			const cardElements = player.faceUpContainer.querySelectorAll('.card');
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

	function faceDownCardClick(player) {
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


	// Recursive function to loop the switchCard function
	async function switchCardLoop(player) {
		while (startButton.style.display !== "none") {
			await switchCard(player);
		}
	}

	async function switchCard(player) {
		const handCard = await firstCardClick(player);
		const faceUpCard = await faceUpCardClick(player);
	  
		// Remove card from hand container
		removeCard(handCard.cardElement, player.handContainer);
		const selectedHandCardIndex = player.hand.indexOf(handCard.card);
		player.hand.splice(selectedHandCardIndex, 1);
	  
		// Remove card from face-up container
		removeCard(faceUpCard.cardElement, player.faceUpContainer);
		const selectedFaceUpCardIndex = player.faceUp.indexOf(handCard.card);
		player.faceUp.splice(selectedFaceUpCardIndex, 1);

		// Add card to hand container
		player.hand.push(faceUpCard.card);
		createCardElement(faceUpCard.card, player.handContainer);
	  
		// Add card to face-up container
		player.faceUp.push(handCard.card);
		createCardElement(handCard.card, player.faceUpContainer);
	  }
	  

	async function playGame() {
		currentPlayerIndex = 0;
		
		// Play the game until there is a winner
		while (!gameOver) {

			isSelectedValid = false;
			const player = players[currentPlayerIndex];
			console.log(`${player.playerName}'s turn`);
			appendToGameLog(players[currentPlayerIndex].playerName + "'s turn");

			// Modify the border width and color
			player.container.style.borderWidth = '3px'; // Set the border width to 3 pixels
			player.container.style.borderColor = 'white'; // Set the border color to white


			console.log("Card to beat: ", centerCard);

			while (isSelectedValid == false) {
				await playTurn(player, centerCard);
			}

			// Assign the last played card to the center card
			centerCard = playedCards[playedCards.length - 1];

			// Modify the border width and color
			player.container.style.borderWidth = '0px'; // Set the border width to 2 pixels
			player.container.style.borderColor = 'black'; // Set the border color to red

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
				player.faceUpContainer.style.display = "none";
			}

			// Check for 4 of a kind
			if (
				playedCards.length >= 4 &&
				playedCards[playedCards.length - 1].rank === playedCards[playedCards.length - 2].rank &&
				playedCards[playedCards.length - 2].rank === playedCards[playedCards.length - 3].rank &&
				playedCards[playedCards.length - 3].rank === playedCards[playedCards.length - 4].rank
			) {
				appendToGameLog("Four of a kind detected!")
				appendToGameLog(players[currentPlayerIndex].playerName + " can play again!")
				burnCards(playedCards);
				centerCard = undefined;
				matchFour = true;
			}

			// Check for winner
			if (player.hand.length === 0 && player.faceUp.length === 0 && player.faceDown.length === 0) {
				appendToGameLog(players[currentPlayerIndex].playerName + " has played all of their cards!")
				// Remove the player from the array
				players.splice(currentPlayerIndex, 1);
				if (!isTrickCard) {
					currentPlayerIndex = (currentPlayerIndex - 1) % numPlayers;
				}
				numPlayers = players.length;
			}

			if (players.length == 1) {
				gameOver = true;
				appendToGameLog(players[0].playerName + " is the SHITHEAD!")
				break;
			}

			// Determine next Player
			if (isTrickCard && !matchFour) {
				handleTrickCards();
			} else if (isSelectedValid) {
				if (!matchFour) {
					// Move to the next player's turn
					currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
				}
			}

			if (gameOver) {
				break;
			}
		}
	}

	dealButton.addEventListener("click", function () {
		initialiseGame();
		startButton.style.display = "flex";
	});

	startButton.addEventListener("click", function () {
		playGame();
		startButton.style.display = "none";
	});


}