var dark = false;
var showingSettings = false;
var showingInstructions = false;
var colors = ["red", "green", "orange", "blue"];
var timer = 2 * 1000;
var timerDecrease = 0.1 * 1000;
var timerMinimum = 0.5 * 1000;
var score = 0;

window.onload = onLoad;

function onLoad() {
    // Uncheck all checkboxes on page load (they may have been checked from before)
    var inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++)  {
        if (inputs[i].type == "checkbox") {
            inputs[i].checked = false;
        }
    }

    setShapeColors("dragShape");
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
        document.getElementById("copyright").style.backgroundColor = "black";
        document.getElementById("copyright").style.color = "white";

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
        document.getElementById("copyright").style.backgroundColor = "white";
        document.getElementById("copyright").style.color = "black";

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
    if (document.getElementById("shufflebox").checked) {
        for (let i = 0; i < colors.length; i++) {
            colors[i] = genRandomColor();
        }
        setShapeColors("dragShape");
    }
    shuffleArray(colors);
    setShapeColors("gameShape");
    setTimeout(hideShapes, timer);
}

function hideShapes() {
    var gameShapes = document.getElementsByClassName("gameShape");
    for (let i = 0; i < gameShapes.length; i++) {
        gameShapes[i].style.backgroundColor = "black";
    }
    timer = Math.max(timer - timerDecrease, timerMinimum);
    setTimeout(showPlayButton, timer); // For now
}

function showPlayButton() {
    document.getElementById("playButton").disabled = false;
}

function shuffleChecked() {
    if (!document.getElementById("shufflebox").checked) {
        colors = ["red", "green", "orange", "blue"];

        setShapeColors("dragShape");
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

function setShapeColors(name) {
    var shapes = document.getElementsByClassName(name);
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].style.backgroundColor = colors[i];
    }
}