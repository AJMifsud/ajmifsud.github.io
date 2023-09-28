window.onload = function () {

	const startButton = document.getElementById("start-button");
	const keyboard = document.getElementById("keyboard");
	const minus = document.getElementById("minus");
	const wordLength = document.getElementById("word-length");
	const plus = document.getElementById("plus");

	startButton.addEventListener("click", function () {
		startButton.style.display = "none";
		keyboard.style.display = "grid";
	});

	plus.addEventListener("click", function () {
		if (wordLength.value <= 19){
		wordLength.value++;
	}
	});

	minus.addEventListener("click", function () {
		if (wordLength.value >= 4){
		wordLength.value--;
	}
	});
}