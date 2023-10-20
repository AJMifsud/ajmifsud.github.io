
window.onload = async function () {

	const words = await getWords();
	const guesses = document.querySelectorAll('.guesses');
	const startButton = document.getElementById("start-button");
	const keyboard = document.getElementById("keyboard");
	const keys = keyboard.querySelectorAll('.key');
	const minus = document.getElementById("minus");
	const wordLength = document.getElementById("word-length");
	const plus = document.getElementById("plus");
	const wordReveal = document.getElementById("word-reveal");
	const winLose = document.getElementById("win-lose");
	const answer = document.getElementById("answer");
	const defineButton  = document.getElementById("define-button");
	const nextButton  = document.getElementById("next-button");
	const definitionsContainer  = document.getElementById("definitions");
	const shadowColors = ["rgb(85, 183, 37)", "rgb(113, 159, 42)", "rgb(141, 134, 47)", "rgb(170, 110, 51)", "rgb(198, 85, 56)", "rgb(226, 61, 61)"];

	keys.forEach(button => {
		button.addEventListener('click', function (event) {
			waitForInput('click', event.target);
		});
	});

	startButton.addEventListener("click", async function () {
		resetGrid();
		resetKeyboard();
		startButton.style.display = "none";
		keyboard.style.display = "grid";
		const word = randomWord(words, parseInt(wordLength.value));
		console.log(`Random Word: ` + word);
		let letters = splitWord(word);
		let correct = false;

		defineButton.addEventListener("click", function () {
			fetchDefinitions(word);
		});

		nextButton.addEventListener("click", function () {
			wordReveal.style.display = "none";
			definitionsContainer.innerHTML = "";
			startButton.style.display = "flex";
			keyboard.style.display = "none";
			correct = true;
			resetGrid();
			resetKeyboard();
		});

		let guessIndex = 0;

		for (const guess of guesses) {
			correct = true;
			const guessLetters = guess.querySelectorAll('.letter');
			let i = 0;
			guess.style.boxShadow = `${shadowColors[guessIndex % shadowColors.length]} 0 0 5px 10px, inset ${shadowColors[guessIndex % shadowColors.length]} 0 0 10px 10px`;
			while (i < guessLetters.length) {
				guessLetters[i].style.boxShadow = "inset rgb(255 255 255 / 30%) 0 0 5px 5px";
				const event = await Promise.race([
					waitForInput('keydown', document),
					waitForInput('click', keys)
				]);
				guessLetters[i].style.boxShadow = "none";
				if (event.type === 'click') {
					if (event.target.textContent == "<<") {
						if (!guessLetters[i].textContent){
							if (i > 0) {
								i--;
							}
							guessLetters[i].textContent = null;
						} else {
							guessLetters[i].textContent = null;
						}
					} else if (event.target.textContent == "ENTER") {
						correct = applyStyles(guessLetters, letters, keys, correct);
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
						if (!guessLetters[i].textContent){
							if (i > 0) {
								i--;
							}
							guessLetters[i].textContent = null;
						} else {
							guessLetters[i].textContent = null;
						}
					} else if (key === 'Enter') {
						correct = applyStyles(guessLetters, letters, keys, correct);
						break;
					}
				}
				

				if (i == guessLetters.length) {
					if (i > 0) {
						i--;
					}
				}
			}

			if (correct){
				break;
			}	  
			
			guessIndex++
		}
		if (correct){
			wordReveal.style.display = "inline-flex";
			winLose.style.background = "rgb(85, 183, 37)";
			winLose.textContent = "You Won!";
			answer.innerHTML = "The word was: <br> <strong>" + word + "</strong>";
			return;
		} else {
			wordReveal.style.display = "inline-flex";
			winLose.style.background = "rgb(226, 61, 61)";
			winLose.textContent = "You Lost!";
			answer.innerHTML = "The word was: <br> <strong>" + word + "</strong>";
			return;
		}
	});

	plus.addEventListener("click", function () {
		if (wordLength.value <= 29) {
			wordLength.value++;

			guesses.forEach(guess => {
				const letter = document.createElement('div');
				letter.className = 'letter';
				guess.appendChild(letter);
			});
			resetGrid();
			resetKeyboard();
			startButton.style.display = "flex";
			keyboard.style.display = "none";
		}
		correct = true;
		return;
	});

	minus.addEventListener("click", function () {
		if (wordLength.value >= 3) {
			wordLength.value--;

			guesses.forEach(word => {
				const guessLetters = word.querySelectorAll('.letter');
				const lastLetter = guessLetters[guessLetters.length - 1];
				word.removeChild(lastLetter);
			});
			resetGrid();
			resetKeyboard();
			startButton.style.display = "flex";
			keyboard.style.display = "none";
		}
		correct = true;
	});

	function resetGrid() {
		guesses.forEach(guess => {
			guess.style.boxShadow = "none";
			const guessLetters = guess.querySelectorAll('.letter');
			for (let i = 0; i < guessLetters.length; i++) {
				guessLetters[i].style.background = "rgb(48, 52, 54)";
				guessLetters[i].textContent = null;
		  	}
		});
	}
	  
	function resetKeyboard(){
		for (i = 0; i < keys.length; i++) {
			keys[i].style.background = "rgb(217, 220, 222)";
		}
	}

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

	function applyStyles(guessLetters, letters, keys, correct) {
		for (let i = 0; i < guessLetters.length; i++) {
			const letterValue = guessLetters[i].textContent.toUpperCase();
	
			// If correct letters
			if (letters[i] === letterValue) {
				guessLetters[i].style.background = "rgb(85, 183, 37)";
				for (let j = 0; j < keys.length; j++) {
					if (keys[j].textContent === letters[i]) {
						keys[j].style.background = "rgb(85, 183, 37)";
					}
				}
			}
			// If contained letters
			else if (letters.includes(letterValue)) {
				correct = false;
				guessLetters[i].style.background = "rgb(218, 195, 22)";
				for (let j = 0; j < keys.length; j++) {
					if (keys[j].textContent === letterValue) {
						if (keys[j].style.background !== "rgb(85, 183, 37)"){
						keys[j].style.background = "rgb(218, 195, 22)";
					}
					}
				}
			}
			else {
				correct = false;
				guessLetters[i].style.background = "rgb(119, 130, 136)";
				for (let j = 0; j < keys.length; j++) {
					if (keys[j].textContent === letterValue) {
						keys[j].style.background = "rgb(119, 130, 136)";
					}
				}
			}
		}
		return correct;
	}

	function fetchDefinitions(word) {
		const apiUrl = `https://www.stands4.com/services/v2/defs.php?uid=12132&tokenid=8UNDwGcuUTy05FYJ&word=${word}&format=json`;
	
		fetch(apiUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				// Check if the API returned a valid response
				if (data && data.result && data.result.length > 0) {
					let definitions = "<strong>Definitions</strong>:<br>";
					let examples = '<br><strong>Examples</strong>:<br>"';
					// Iterate through each result and display information
					for (let i = 0; i < data.result.length; i++) {
						const result = data.result[i];
						const definition = `${i + 1}. ${result.definition.charAt(0).toUpperCase() + result.definition.slice(1).toLowerCase()}` + "<br>";
	
						if (result.example && typeof result.example === 'string' && result.example.trim() !== '') {
							const example = `${i + 1}. ${result.example.charAt(1).toUpperCase() + result.example.slice(2).toLowerCase()}` + "<br>";
							examples += example;
						}
						definitions += definition;
					}
	
					definitions += examples;
					definitionsContainer.innerHTML = definitions;
				} else {
					definitionsContainer.textContent = 'No definition found.';
				}
			})
			.catch(error => console.error('Error fetching definition:', error));
	}
}