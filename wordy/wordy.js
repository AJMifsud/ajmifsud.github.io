window.onload = function () {

	const guesses = document.querySelectorAll('.guesses');
	const startButton = document.getElementById("start-button");
	const keyboard = document.getElementById("keyboard");
	const minus = document.getElementById("minus");
	const wordLength = document.getElementById("word-length");
	const plus = document.getElementById("plus");

	function waitForInput(eventType, element) {
		return new Promise(resolve => {
		  function eventHandler(event) {
			resolve(event);
			element.removeEventListener(eventType, eventHandler);
		  }
		  element.addEventListener(eventType, eventHandler);
		});
	  }

	  startButton.addEventListener("click", async function () {
		startButton.style.display = "none";
		keyboard.style.display = "grid";
		let word = "dog";
		let letters = splitWord(word);
	  
		for (const guess of guesses) {
		  const guessLetters = guess.querySelectorAll('.letter');
	  
		  for (let i = 0; i < guessLetters.length; i++) {
			const letter = guessLetters[i];
			const event = await Promise.race([
			  waitForInput('keydown', document),
			  waitForInput('click', startButton)
			]);
	  
			if (event.type === 'keydown') {
				const key = event.key;
			  
				// Check if the key is a character (a-z) and convert to uppercase
				if (key.match(/^[a-zA-Z]$/)) {
				  const newText = key.toUpperCase();
				  letter.textContent = newText;
				}
			  }
		  }
		}
	  });
	

	plus.addEventListener("click", function () {
		if (wordLength.value <= 20){
		wordLength.value++;

        guesses.forEach(guess => {
            const letter = document.createElement('div');
            letter.className = 'letter';
            guess.appendChild(letter);
        });

		startButton.style.display = "flex";
		keyboard.style.display = "none";
	}
	});

	minus.addEventListener("click", function () {
		if (wordLength.value >= 4){
		wordLength.value--;

        guesses.forEach(word => {
            const letters = word.querySelectorAll('.letter');
            const lastLetter = letters[letters.length - 1];
            	word.removeChild(lastLetter);
        });
		
		startButton.style.display = "flex";
		keyboard.style.display = "none";
	}
	});

	function splitWord(word) {
		const letters = word.toUpperCase().split('');
		return letters;
	  }
}