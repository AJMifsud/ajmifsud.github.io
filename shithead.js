window.onload = function () {

	//-----------//
	//PAGE LAYOUT//
	//-----------//

	const playPile = document.querySelector("#play-pile");
	const playedCards = Array.from(playPile.querySelectorAll(".card"));

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
	// Get the button element by its ID
	const dealButton = document.getElementById("dealButton");

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
	
	jokersCheck.addEventListener('change', function() {
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

	function createDeck(withJokers) {
		const suits = ["clubs", "diamonds", "hearts", "spades"];
		const ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
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
		  deck.push({ rank: "joker", frontImage: "images/cards/black_joker.png"});
		  deck.push({ rank: "joker", frontImage: "images/cards/red_joker.png"});
		}
	  
		return deck;
	  }
  

	// Define a function to shuffle a deck of cards
	function shuffleDeck(deck) {
		for (let i = deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
	}


	function logDeckOrder(deck) {
		console.log("Deck order:");
		for (let i = 0; i < deck.length; i++) {
		  console.log(`${deck[i].value} of ${deck[i].suit}`);
		}
	  }
	  
	  function createCardElement(card) {
		const cardElement = document.createElement("div");
		cardElement.classList.add("card");
	  
		const cardFrontElement = document.createElement("div");
		cardFrontElement.classList.add("card-front");
		cardFrontElement.style.backgroundImage = `url(${card.frontImage})`;
	  
		const cardBackElement = document.createElement("div");
		cardBackElement.classList.add("card-back");
	  
		cardElement.appendChild(cardFrontElement);
		cardElement.appendChild(cardBackElement);
	  
		const drawPile = document.getElementById("draw-pile");
		drawPile.appendChild(cardElement);
	  
		return cardElement;
	  }
	  

	  dealButton.addEventListener("click", function() {
		const withJokersCheckbox = document.getElementsByName("withJokers")[0];
		const withJokers = withJokersCheckbox.checked ? "Yes" : "No";
		const deck = createDeck(withJokers);
		shuffleDeck(deck);
		logDeckOrder(deck);
		
		const drawPile = document.getElementById("draw-pile");
		for (let card of deck) {
		  const cardElement = createCardElement(card);
		  drawPile.appendChild(cardElement);
		}
		
		updateCardCount();
	  });
	  




}