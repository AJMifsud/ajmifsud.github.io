	// Define a function to create a new deck of cards
	function createDeck() {
		// Define arrays for the suits and values of the cards
		const suits = ["hearts", "diamonds", "clubs", "spades"];
		const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
		// Create an empty array to hold the cards
		const deck = [];
		// Define a variable for whether to include jokers in the deck (not used in this version)
		let withJokers = "";
		// Use a switch statement to create the deck with or without jokers, based on the value of the withJokers variable
		switch (withJokers) {
			case "No":
				// Create cards without jokers by looping over the suits and values and pushing new objects onto the deck array for each card
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
				// Create jokers by pushing two new objects onto the deck array with a value of "Joker" and a suit of "joker"
				for (let i = 0; i < 2; i++) {
					deck.push({
						value: "Joker",
						suit: "joker"
					});
				}
				break;
		}
		// Return the completed deck of cards
		return deck;
	}


	// Define a function to shuffle a deck of cards
	function shuffleDeck(deck) {
		for (let i = deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
	}

	// Create a new deck of cards
	const deck = createDeck();

	// Shuffle the deck
	shuffleDeck(deck);