let intentos = 6;
let listado_palabras = ['LIMON', 'TIGRE', 'SALIR', 'ROBLE', 'GRUPO', 'LUNAR', 'CARNE', 'CALOR', 'POLAR', 'PLUMA'];
const BUTTON = document.getElementById("guess-button");
const INPUT = document.getElementById("guess-input");
const VALOR = INPUT.value;
const CONTENEDOR = document.getElementById("guesses");
const GRID = document.getElementById("grid");
const openaiApiKey = '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'; 

window.addEventListener('load', init);
setup();
async function intentar(WORD) {
	const USER_INPUT = read_input();
	const ROW = document.createElement("div");
	ROW.className = "row";
	const palabra = WORD.toUpperCase();
	console.log("Don't cheat >:( " + palabra);
	if (USER_INPUT === palabra){
		winning(ROW, USER_INPUT);
		return;
	} else {
		continuing(ROW, USER_INPUT, palabra);
	}
	intentos --; 
	losing(intentos, palabra);
}
function init() {
	console.log("El trigger funciona!");
}
async function setup() {
    WORD = await api_call();
    BUTTON.addEventListener('click', function () {
        intentar(WORD);
    });
}
function read_input() {
	let intento = INPUT; 
	intento = intento.value;
	intento = intento.toUpperCase();
	return intento;
}
function terminar(mensaje) {
	INPUT.style.display = "none";
	CONTENEDOR.style.display = "block";
	CONTENEDOR.innerHTML = mensaje;
}
function winning(ROW, USER_INPUT){
		terminar("GANASTE!!!!!!!!! :D");
		for (let i in USER_INPUT) {
			const SPAN = document.createElement("span");
			SPAN.className = "letter";
			SPAN.innerHTML = USER_INPUT[i];
			SPAN.style.backgroundColor = "#79b851"
			ROW.appendChild(SPAN);
		}
		GRID.appendChild(ROW);
		BUTTON.innerHTML = "Juega otra vez"
		BUTTON.addEventListener('click', function () {
			restart();
		});
		return;
}
function continuing(ROW, USER_INPUT, palabra){
	for (let i in palabra) {
		const SPAN = document.createElement("span");
		SPAN.className = "letter";
		if (USER_INPUT[i] === palabra[i]) {
			SPAN.innerHTML = USER_INPUT[i];
			SPAN.style.backgroundColor = "#79b851";
		} else if (palabra.includes(USER_INPUT[i])) {
			SPAN.innerHTML = USER_INPUT[i];
			SPAN.style.backgroundColor = "#f3c237";
		} else {
			SPAN.innerHTML = USER_INPUT[i];
			SPAN.style.backgroundColor = "#a4aec4";
		}
		ROW.appendChild(SPAN);
	}
	GRID.appendChild(ROW);	
}
function losing(intentos, palabra) {
	if (intentos == 0 ) {
		console.log("Se te han acabado los intentos, la palabra era: " + palabra);
		terminar("Perdiste!");
		BUTTON.innerHTML = "Juega otra vez"
		BUTTON.addEventListener('click', function () {
			restart();
		});
	}
}
function restart() {
	location.reload();
	return false;
}
async function api_call() {
	const response = await fetch('https://random-word-api.herokuapp.com/word?number=1000&lang=es');
	const result = await response.json();
    if (!response.ok) {
        const generateWord = listado_palabras[Math.floor(Math.random() * listado_palabras.length)];
        return generateWord
    } else {
        const five_letters_words = result.filter(word => word.length === 5 && word[0] === word[0].toLowerCase());
        const words_without_accents = five_letters_words.map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        console.log(words_without_accents);
		const random_index = Math.floor(Math.random() * words_without_accents.length);
		const random_word = words_without_accents[random_index];
		return random_word;
    }  	
}




