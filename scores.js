var dark = false;
var showingSettings = false;
var showingInstructions = false;
var colors = ["red", "green", "orange", "blue"];
var timer;
const timerSteepness = 0.5; // Lower values increase steepness
var shapeOrder; // An array of divs
var shapeGuesses; // An array of divs
var score;
var guessing;

window.onload = onLoad;

function onLoad() {
    // Uncheck all checkboxes on page load (they may have been checked from before)
    var inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++)  {
        if (inputs[i].type == "checkbox") {
            inputs[i].checked = false;
        }
    }
    
    shuffleArray(colors);
    setShapeColors("gameShape");
    disallowGuessing();
}

function toggleOnClick() {
    var gameShapes = document.getElementsByClassName("gameShape");
    if (!guessing) {
        // Disable the onclick property so that the user can only click during the guessing period
        for (let i = 0; i < gameShapes.length; i++) {
            gameShapes[i].onclick = null;
        }
    }
    else {
        for (let i = 0; i < gameShapes.length; i++) {
            gameShapes[i].onclick = function() {
                checkShape(gameShapes[i]); // Allow each game shape to be clicked
            };
        }
    }
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

function showSettings() {
    showingSettings = !showingSettings;
    if (showingSettings && !showingInstructions) { // Don't show both menus at once and cause overlap
        document.getElementById("settingsmenu").style.visibility = "visible";
    }
    else {
        document.getElementById("settingsmenu").style.visibility = "hidden";
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

function restartGame() {
    document.getElementById("playButton").disabled = true;
    shapeGuesses = [];
    shapeOrder = [];
    setScore(0);
    timer = 1 * 1000;
    flashShapes();
}

function goNextRound() {
    shapeGuesses = []; // Only reset the current shape guesses
    timer = (1.75 * (timerSteepness**score) + 0.25) * 1000; // Time as a function of score (starts at 2, tends to 0.25). Tweaking timerSteepness will change the steepness of the time decrease.
    flashShapes();
}

async function flashShapes() {
    if (shapeOrder.length > 0) { // First, check if we already have shapes stored, and go through those first
        for (let i = 0; i < shapeOrder.length; i++) {
            var randShape = shapeOrder[i];
            randShape.style.opacity = "1.0";
            await sleep(timer).then(function() {
                randShape.style.opacity = "0.5";
            });
            await sleep(0.3 * 1000);
        }
    }
    // After we're finished, we generate a new shape
    var gameShapes = document.getElementsByClassName("gameShape");
    var randShape = gameShapes[genRandomInteger(0, 3)];
    shapeOrder.push(randShape);

    randShape.style.opacity = "1.0";
    await sleep(timer).then(function() {
        randShape.style.opacity = "0.5";
    });
    await sleep(0.3 * 1000); // Little grace period after unflashing in case it choose the same shape again so the transition finishes
    allowGuessing();
}

function allowGuessing() {
    guessing = true;
    toggleOnClick();
}

function disallowGuessing() {
    guessing = false;
    toggleOnClick();
}

async function checkShape(div) {
    // Quickly flash the shape that is clicked
    div.style.opacity = "1.0";
    await sleep(200).then(function() {
        div.style.opacity = "0.5";
    });

    shapeGuesses.push(div);
    if (shapeGuesses[shapeGuesses.length - 1] != shapeOrder[shapeGuesses.length - 1]) {
        // Lose game (add lose screen)
        disallowGuessing();
        showPlayButton(); // Play button allows you to restart the game
    }
    else if (shapeGuesses.length == shapeOrder.length) { // If the player got to the final shape correctly
        // Win round
        setScore(score + 1);
        disallowGuessing();
        await sleep(0.8 * 1000); // Add a small delay in between rounds
        goNextRound();
    }
}

function showPlayButton() {
    document.getElementById("playButton").disabled = false;
}

function shuffleChecked() {
    if (document.getElementById("shufflebox").checked) {
        for (let i = 0; i < colors.length; i++) {
            colors[i] = genRandomColor();
        }
        setShapeColors("gameShape");
    }
    else {
        colors = ["red", "green", "orange", "blue"];
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function setShapeColors(name) {
    var shapes = document.getElementsByClassName(name);
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].style.backgroundColor = colors[i];
    }
}

function setScore(num) {
    score = num;
    document.getElementById("scoreText").innerHTML = score;
}

function genRandomColor() { /* Hard mode: have the colors be "closer" to each other */
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    var brightness = 15; /* The higher the number the brighter the color (up to 15) */
    var chars = 6;
    for (var i = 0; i < chars; i++) {
        color += letters[Math.round(Math.random() * Math.min(brightness, 15))];
    }
    return color;
}

function genRandomInteger(min, max) { // Min inclusive, max inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}