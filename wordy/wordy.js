window.onload = async function () {

	const words = await getWords();
	const guesses = document.querySelectorAll('.guesses');
	const startButton = document.getElementById("start-button");
	const keyboard = document.getElementById("keyboard");
	const keys = keyboard.querySelectorAll('.key');
	const minus = document.getElementById("minus");
	const wordLength = document.getElementById("word-length");
	const plus = document.getElementById("plus");

	keys.forEach(button => {
		button.addEventListener('click', function (event) {
			waitForInput('click', event.target);
		});
	});

	startButton.addEventListener("click", async function () {
		startButton.style.display = "none";
		keyboard.style.display = "grid";
		const word = randomWord(words, parseInt(wordLength.value));
		console.log(`Random Word: ` + word);
		let letters = splitWord(word);

		for (const guess of guesses) {
			const guessLetters = guess.querySelectorAll('.letter');
			let i = 0;

			while (i < guessLetters.length) {
				const event = await Promise.race([
					waitForInput('keydown', document),
					waitForInput('click', keys)
				]);

				if (event.type === 'click') {
					if (event.target.textContent == "<<") {
						guessLetters[i].textContent = '';
						if (i > 0) {
							i--;
						}
					} else if (event.target.textContent == "ENTER") {

						for (i = 0; i < guessLetters.length; i++) {
							const letterValue = guessLetters[i].textContent.toUpperCase();
							if (letters[i] == letterValue) {
								guessLetters[i].style.background = "rgb(85, 183, 37)";
							} else if (letters.includes(letterValue)) {
								guessLetters[i].style.background = "rgb(218, 195, 22)";
							} else {
								guessLetters[i].style.background = "rgb(119, 130, 136)";
							}
						}

						break;
					} else {
						const newText = event.target.textContent.toUpperCase();
						guessLetters[i].textContent = newText;
						i++;
					}
				} else if (event.type === 'keydown') {
					const key = event.key;

					if (key.match(/^[a-zA-Z]$/)) {
						const newText = key.toUpperCase();
						guessLetters[i].textContent = newText;
						i++;
					} else if (key === 'Backspace') {
						guessLetters[i].textContent = '';
						if (i > 0) {
							i--;
						}
					} else if (key === 'Enter') {

						for (i = 0; i < guessLetters.length; i++) {
							const letterValue = guessLetters[i].textContent.toUpperCase();
							//If correct letters
							if (letters[i] == letterValue) {
								guessLetters[i].style.background = "rgb(85, 183, 37)";
								for (j = 0; j < keys.length; j++) {
									if (keys[j].textContent == letters[i]){
										keys[j].style.background = "rgb(85, 183, 37)";
									}
								}
							//If contained letters
							} else if (letters.includes(letterValue)) {
								guessLetters[i].style.background = "rgb(218, 195, 22)";
								for (j = 0; j < keys.length; j++) {
									if (keys[j].textContent == letterValue){
										keys[j].style.background = "rgb(218, 195, 22)";
									}
								}
							} else {
								guessLetters[i].style.background = "rgb(119, 130, 136)";
								for (j = 0; j < keys.length; j++) {
									if (keys[j].textContent == letterValue){
										keys[j].style.background = "rgb(119, 130, 136)";
									}
								}
							}
						}

						break;
					}
				}

				if (i == guessLetters.length) {
					if (i > 0) {
						i--;
					}
				}
			}
		}
	});


	plus.addEventListener("click", function () {
		if (wordLength.value <= 29) {
			wordLength.value++;

			guesses.forEach(guess => {
				const letter = document.createElement('div');
				letter.className = 'letter';
				guess.appendChild(letter);
				
				const guessLetters = guess.querySelectorAll('.letter');
				for (i = 0; i < guessLetters.length; i++) {
						guessLetters[i].style.background = "rgb(48, 52, 54)";
						guessLetters[i].textContent = null;
				}
			});

			startButton.style.display = "flex";
			keyboard.style.display = "none";
		}
	});

	minus.addEventListener("click", function () {
		if (wordLength.value >= 3) {
			wordLength.value--;

			guesses.forEach(word => {
				const guessLetters = word.querySelectorAll('.letter');
				const lastLetter = guessLetters[guessLetters.length - 1];
				word.removeChild(lastLetter);

				for (i = 0; i < guessLetters.length; i++) {
						guessLetters[i].style.background = "rgb(48, 52, 54)";
						guessLetters[i].textContent = null;
				}
				
			});

			startButton.style.display = "flex";
			keyboard.style.display = "none";
		}
	});

	async function getWords() {
		const response = await fetch('wordy/words.csv');
		const csvData = await response.text();
		const words = csvData.split(',');
		return words;
	}

	function waitForInput() {
		return new Promise(resolve => {
			function eventHandler(event) {
				resolve(event);
			}
			keys.forEach(key => key.addEventListener('click', eventHandler));
			document.addEventListener('keydown', eventHandler);
		});
	}

	function randomWord(words, wordLength) {
		// Filter words based on the specified length
		const filteredWords = words.filter(word => word.length === wordLength);
		
		// Randomly select a word from the filtered list
		const randomIndex = Math.floor(Math.random() * filteredWords.length);
		return filteredWords[randomIndex];
	}
	  
	function splitWord(word) {
		const letters = word.toUpperCase().split('');
		return letters;
	}
}