window.onload = function () {

	const guesses = document.querySelectorAll('.guesses');
	const startButton = document.getElementById("start-button");
	const keyboard = document.getElementById("keyboard");
	const minus = document.getElementById("minus");
	const wordLength = document.getElementById("word-length");
	const plus = document.getElementById("plus");

	startButton.addEventListener("click", function () {
		startButton.style.display = "none";
		keyboard.style.display = "grid";
		let word = "dog";
		letters = splitWord(word);
		console.log(letters); // Output the array of characters in uppercase
	});

	plus.addEventListener("click", function () {
		if (wordLength.value <= 19){
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