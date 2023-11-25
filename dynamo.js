let highscore = parseInt(localStorage.getItem('highscore')) || 0;
var showingSettings = false;
var showingInstructions = false;
var dark = false;

function startup() {
    const result2Element = document.getElementById("result2");
    result2Element.textContent = `Your HIGH SCORE: ${highscore}`;
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


let shuffledNumbers = [];
let shuffledColors = [];
let assignedColors = {};
let score = 0;
let timer = 5000;



function startgame() {

    computerguesses = [];
    userguesses = [];

    shuffledNumbers = [1, 2, 3, 4];
    shuffleArray(shuffledNumbers);
    shuffledColors = ['blue', 'red', 'green', 'orange'];
    shuffleArray(shuffledColors);


    const startgameButton = document.getElementById('startgame');
    startgameButton.disabled = true;

    const checkguessButton = document.getElementById('checkGuess');
    checkguessButton.disabled = true;


    const shapes = document.querySelectorAll('.shape p');

    for (let i = 0; i < shuffledColors.length; i++) {
        shapes[i].textContent = shuffledNumbers[i]; 
        const shapeId = `shape${i + 1}`;
        const shape = document.getElementById(shapeId);
        shape.style.backgroundColor = shuffledColors[i]; 
        assignedColors[shapeId] = { color: shuffledColors[i], number: shuffledNumbers[i] };
    }

    console.log(assignedColors)

    setTimeout(() => {
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].textContent = '';
            const shapeId = `shape${i + 1}`;
            const shape = document.getElementById(shapeId);
            shape.style.backgroundColor = 'black';
        }
        const radioButtons = document.querySelectorAll('input[type="radio"]');

        for (const radioButton of radioButtons) {
            radioButton.removeAttribute('disabled');
        }
        checkguessButton.disabled = false;

    }, timer);
}

function getNumberForColor(color) {
    for (const shapeId in assignedColors) {
        if (assignedColors[shapeId].color === color) {
            return assignedColors[shapeId].number;
        }
    }
    return null; 
}


function checkGuessNumbers() {


    computerguesses.push(getNumberForColor('blue'), getNumberForColor('red'), getNumberForColor('green'), getNumberForColor('orange'));

    const resultElement = document.getElementById("result");
    const result2Element = document.getElementById("result2");
    let correctGuess = true;


    for(let i = 0; i <= 3; i++) {
        var userGuess = getSelectedRadioValue('shape-' + (i + 1) + '-color');
        userguesses.push(userGuess)
    }

    
    for (let i = 0; i < 4; i++) {
        if (userguesses[i] !== computerguesses[i]) {
            correctGuess = false;
            break;
        }
    }



    const checkGuessButton = document.getElementById('checkGuess');
    checkGuessButton.disabled = true; 

    const radioButtons = document.querySelectorAll('input[type="radio"]');
    for (const radioButton of radioButtons) {
        radioButton.setAttribute('disabled', true);
    }


    if (correctGuess) {
        score++;
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
        }
        timer -= 500;
        resultElement.textContent = "Correct guess!";
        resultElement.style.color = "green";
        result2Element.textContent = `Your score: ${score}  HIGH SCORE: ${highscore}`;
        startgame();
    } else {
        timer = 5000;
        score = 0;
        resultElement.textContent = "Incorrect guess. Try again!";
        resultElement.style.color = "red";
        result2Element.textContent = `Your score: ${score}  HIGH SCORE: ${highscore}`;
        startgame();
    }
}

function getSelectedRadioValue(name) {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            return parseInt(radioButton.value);
        }
    }
    return null;
}

function getAssignedNumber(color) {
    for (const shapeId in assignedColors) {
        if (assignedColors[shapeId].color === color) {
            return assignedColors[shapeId].number;
        }
    }
    return null;
}


function switchModes(img) {
    dark = !dark;
    if (dark) {
        img.src = "images/light.png";
        document.getElementById("navbar").style.backgroundColor = "black";
        var navdivs = document.getElementsByClassName("navdiv");
        for (var i = 0; i < navdivs.length; i++) {
            var current = navdivs[i];
            if (current.getAttribute("id") != "icondiv") { // Skip the border overwrite for the icondiv, we don't want a border for that element
                current.style.borderRight = "4px solid white";
            }
            current.firstElementChild.style.color = "white"; // Gets each hyperlink of each navdiv
        }
        document.getElementById("content").style.backgroundColor = "gray";

        document.getElementById("modeicon").style.transform = "translateX(35px)";
    }
    else {
        img.src = "images/dark.png";
        document.getElementById("navbar").style.backgroundColor = "white";
        var navdivs = document.getElementsByClassName("navdiv");
        for (var i = 0; i < navdivs.length; i++) {
            var current = navdivs[i];
            if (current.getAttribute("id") != "icondiv") {
                current.style.borderRight = "4px solid black";
            }
            current.firstElementChild.style.color = "black"; // Gets each hyperlink of each navdiv
        }
        document.getElementById("content").style.backgroundColor = "lightgray";

        document.getElementById("modeicon").style.transform = "translateX(0px)";
    }
}



function showInstructions() {
    showingInstructions = !showingInstructions;
    if (showingInstructions && !showingSettings) {
        document.getElementById("instructionsmenu").style.visibility = "visible";
    }
    else {
        document.getElementById("instructionsmenu").style.visibility = "hidden";
    }
}

function showSettings() {
    showingSettings = !showingSettings;
    if (showingSettings && !showingInstructions) { 
        document.getElementById("settingsmenu").style.visibility = "visible";
    }
    else {
        document.getElementById("settingsmenu").style.visibility = "hidden";
    }
}

var selectedgamemode = " ";

function changeGameMode(selectElement) {
    var selectedValue = selectElement.value;

    if (selectedValue === "mode1") {
        selectedgamemode = "mode1";

    } else if (selectedValue === "mode2") {
        selectedgamemode = "mode2";

    } else if (selectedValue === "mode3") {
        selectedgamemode = "mode3";
    }
    else {
        selectedgamemode = "mode3";
    }

    
}

function saveGameMode(){
    if (selectedgamemode == "mode1"){
        gamemode1();
    }
    else if (selectedgamemode == "mode2"){
        gamemode2();
    }
    else if (selectedgamemode == "mode3"){
        gamemode3(); 
    }
    else {
        gamemode3();
    }
}



function gamemode3() {
    window.location.href = "mode3.html"
}

function gamemode1() {
    window.location.href = "index.html"
}

function gamemode2(){
    window.location.href = "mode2.html"
}


function switchModes(img) {
    dark = !dark;
    if (dark) {
        img.src = "images/light.png";
        document.getElementById("navbar").style.backgroundColor = "black";
        var navdivs = document.getElementsByClassName("navdiv");
        for (var i = 0; i < navdivs.length; i++) {
            var current = navdivs[i];
            if (current.getAttribute("id") != "icondiv") { // Skip the border overwrite for the icondiv, we don't want a border for that element
                current.style.borderRight = "4px solid gray";
            }
            current.firstElementChild.style.color = "white"; // Gets each hyperlink of each navdiv
        }
        document.getElementById("content").style.backgroundColor = "darkgray";

        document.getElementById("modeicon").style.transform = "translateX(35px)";
    }
    else {
        img.src = "images/dark.png";
        document.getElementById("navbar").style.backgroundColor = "lightgray";
        var navdivs = document.getElementsByClassName("navdiv");
        for (var i = 0; i < navdivs.length; i++) {
            var current = navdivs[i];
            if (current.getAttribute("id") != "icondiv") {
                current.style.borderRight = "4px solid black";
            }
            current.firstElementChild.style.color = "black"; // Gets each hyperlink of each navdiv
        }
        document.getElementById("content").style.backgroundColor = "white";

        document.getElementById("modeicon").style.transform = "translateX(0px)";
    }
}