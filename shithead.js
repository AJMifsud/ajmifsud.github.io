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

	// Call the function initially and then on any change to the draw pile
	updateCardCount();
	drawPile.addEventListener('change', updateCardCount);




















	
//----------//
//GAME LOGIC//
//----------//

// Define the necessary variables and arrays
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const players = [];
let currentPlayer = 0;
let currentCard = null;
let burntPile = [];

// Define the Player class
class Player {
	constructor(playerName, hand, faceDown, faceUp) {
		this.name = playerName;
		this.hand = hand;
		this.faceDown = faceDown;
		this.faceUp = faceUp;
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

function logDeckOrder(deck) {
	console.log("Deck order:");
	for (let i = 0; i < deck.length; i++) {
		console.log(`${deck[i].rank} of ${deck[i].suit}`);
	}
}

// Define the onClick function to handle card selection
function onClick(card) {
	// Update the selectedCard variable with the clicked card's value
	selectedCard = card;
  }
  

function createCardElement(card, targetElement, onClick) {
	const cardElement = document.createElement("div");
	cardElement.classList.add("card", card.suit, "rank" + card.rank);
  
	const cardFrontElement = document.createElement("div");
	cardFrontElement.classList.add("card-front");
	cardFrontElement.style.backgroundImage = `url(${card.frontImage})`;
  
	const cardBackElement = document.createElement("div");
	cardBackElement.classList.add("card-back");
  
	// Add a click event listener to the card element
	cardElement.addEventListener("click", () => {
	  onClick(card);
	});
  
	cardElement.appendChild(cardFrontElement);
	cardElement.appendChild(cardBackElement);
  
	targetElement.appendChild(cardElement);
  
	return cardElement;
  }
  

function removeCard(cardElement) {
	const parentElement = cardElement.parentNode;
	parentElement.removeChild(cardElement);
}



function playerTurn(currentPlayer) {
	return new Promise(resolve => {
		let selectedCard = null;
		const onClick = cardElement => {
			selectedCard = currentPlayer.hand.find(card => cardElement.classList.contains(card.suit) && cardElement.classList.contains('rank' + card.rank));
			if (selectedCard) {
				resolve(selectedCard);
			}
		};
	});
}

function isCardValid(selectedCard, centerCard) {
	// The selected card must have the same rank or the same suit as the center card
	return selectedCard.rank === centerCard.rank || selectedCard.suit === centerCard.suit;
}


startButton.addEventListener("click", function () {
	// Get the number of players from the input field
	const numPlayers = parseInt(document.getElementById('numPlayers').value);
	const withJokersCheckbox = document.getElementsByName("withJokers")[0];
	const withJokers = withJokersCheckbox.checked ? "Yes" : "No";
	const gameOver = "False";

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
		player.playerName = playerName;
		player.handContainer = handContainer;
		player.faceUpContainer = faceUpContainer;
		player.faceDownContainer = faceDownContainer;

		players.push(player);
		// Deal three cards to each player's face-down-cards container
		for (let j = 0; j < 3; j++) {
			const card = deck.pop();
			player.faceDown.push(card);
			createCardElement(card, player.faceDownContainer, onClick);
		}

		// Deal three cards to each player's face-up-cards container
		for (let j = 0; j < 3; j++) {
			const card = deck.pop();
			player.faceUp.push(card);
			createCardElement(card, player.faceUpContainer, onClick);
		}

		// Deal three cards to each player's playable-cards container
		for (let j = 0; j < 3; j++) {
			const card = deck.pop();
			player.hand.push(card);
			createCardElement(card, player.handContainer, onClick);
		}
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

	// main game loop
	while (gameOver === false) {

		//Loop through all players
		for (let i = 0; i < numPlayers; i++) {

			// get the current player and the center card from the play pile
			const currentPlayer = players[i];
			const centerCard = playPile[playPile.length - 1];
			let selectedCard = null; // initialize selectedCard to null
			// wait for player to select a card and assign it to selectedCard
			selectedCard = playerTurn(currentPlayer, centerCard);

			// check if the selected card is valid, if not continue the loop
			if (centerCard && !isCardValid(selectedCard, centerCard)) {
			    console.log('Invalid card');
			    continue;
			}


			// add the selected card to the play pile and remove it from the player's hand
			playPile.push(selectedCard);
			currentPlayer.hand = removeCard(currentPlayer.hand, selectedCard);

			// check if the player has won (no more cards in hand, face down or face up piles)
			if (currentPlayer.hand.length === 0 && currentPlayer.faceDown.length === 0 && currentPlayer.faceUp.length === 0) {
				console.log('Player ' + currentPlayer.name + ' has won!');
				gameOver = true;
			}

			// move on to the next player
			currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
		}
	}


});


}