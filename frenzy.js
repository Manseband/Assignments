var highscore = parseInt(localStorage.getItem('highscore')) || 0;
var showingSettings = false;
var showingInstructions = false;
var dark = false;

window.onload = onLoad;

function onLoad() {
    // Uncheck all checkboxes on page load (they may have been checked from before)
    var inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++)  {
        if (inputs[i].type == "checkbox") {
            inputs[i].checked = false;
        }
    }

    var select = document.getElementById("modeselect");
    switch (document.location.href.split("/").slice(-1)[0]) { // Splits the name of the html file from the full URL
        case "index.html":
            select.value = "1";
        case "frenzy.html":
            select.value = "2";
    }
    // Call the changeMode function when a select event is detected
    select.addEventListener("change", function() {
        changeMode(this.value);
    });

    document.getElementById("shufflebox").disabled = "true"; // Disable shuffling colors in this mode

    startup();
}


function startup() {
    const resultElement = document.getElementById("result");
    resultElement.textContent = `Your score: ${score}  HIGH SCORE: ${highscore}`;
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
    startgameButton.style.display = "none";

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

    // console.log(assignedColors)

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

    var resultElement = document.getElementById("result");
    var infoElement = document.getElementById("info");
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
        resultElement.textContent = `Your score: ${score}  HIGH SCORE: ${highscore}`;
        infoElement.style.color = "green";
        infoElement.textContent = "Correct Guess!";
        startgame();
    } else {
        timer = 5000;
        score = 0;
        resultElement.textContent = `Your score: ${score}  HIGH SCORE: ${highscore}`;
        infoElement.style.color = "red";
        infoElement.textContent = "Wrong guess. Starting over!";
        startgame();
    }
}

function resetScore() {
    highscore = 0;
    localStorage.setItem('highscore', 0);
    document.getElementById("result").textContent = `Your score: ${score}  HIGH SCORE: ${highscore}`;
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

function switchTheme(img) {
    dark = !dark;
    const body = document.body;
    const radioLabels = document.querySelectorAll('.radio-group label');

    if (dark) {
        radioLabels.forEach(label => {
            label.style.color = 'white';
        });
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
        document.getElementById("content").style.backgroundColor = "#454545";
        document.getElementById("result").style.backgroundColor = "black";
        document.getElementById("copyright").style.backgroundColor = "black";
        document.getElementById("copyright").style.color = "white";
        document.getElementById("modeicon").style.transform = "translateX(35px)";
        

    }
    else {
        radioLabels.forEach(label => {
            label.style.color = 'black';
        });
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
        document.getElementById("result").style.backgroundColor = "white";
        document.getElementById("copyright").style.backgroundColor = "white";
        document.getElementById("copyright").style.color = "black";

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

function changeMode(num) {
    switch (num) {
        case "1":
            document.location.href = "index.html";
            break;
        case "2":
            document.location.href = "frenzy.html";
            break;
    }
}

function closemenu() {
    showingSettings = false;
    showingInstructions = false;
    document.getElementById("settingsmenu").style.visibility = "hidden";
    document.getElementById("instructionsmenu").style.visibility = "hidden";
}
