var canvas, ctx;
var fontSize = 18; //for matrix anim

var SPEED = 50;

//game logic variables
var columns = new Array(); // from the matrix anim (delete?)
var boardWidth = 20; // how many tiles is the gameboard wide?
var boardHeight = 20; // how many tiles is the gameboard high?
var tileSize = 16; // how big is one tile? (width and height)
var score = 0;
var loopFunctionId;
var audioLayBomb, audioBombExplode, audioBackground, audioDeath, audioGameOver;
var board = newMatrix(boardHeight, boardWidth); // saves the information about the gameboard

var running = false;

//create enum for all types of tile that can exist on the gameboard
var tileTypes = Object.freeze({ 
    "wall":0,
    "empty":1,
    "breakable_wall": 2,
    "bomb": 3
});

//draws the gameboard part within the canvas
function drawGameboard(data, canvas, ctx, height, width) {
    for(var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if(data[i][j] === undefined) {
                ctx.drawImage(document.getElementById('art_assets'),
                160, 64, 16, 16, i * tileSize, j * tileSize, tileSize, tileSize);
            } else {
                console.log("DEFINED");
            }
        }
    }
}

//--------------------------------------------------------------------------
window.onload = function(){
    canvas = document.getElementById("game_canvas");
    ctx = canvas.getContext("2d");

    //background music
    audioBackground = new Audio("../sound/background.mp3");
    audioBackground.loop = true;
    audioBackground.play();

    setInterval(animation, 50);

}

function startGame() {
    running = true;
    startView.setAttribute("visibility", "hidden");
    audioBackground.play();
    //TODO: init player, generate random map, init monsters
    
    generateRandomGameboard(board, boardWidth, boardHeight);
    
    loopFunctionId = setInterval(loop, SPEED);
}

//generates a random map (unbreakable walls on the outside,
// regular grid structure of unbreakable walls,
// randomly generated breakable walls on the rest)
function generateRandomGameboard(board, width, height) {
    for(var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            console.log(`${height} ${width}`);
        }
    }
}

function loop() {
    //TODO:
        //move enemies
        //move bomberman
        //bombs tick
}

//--------------------------------------------------------------------------
function initializeAnimation() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

}

//--------------------------------------------------------------------------
function animation() {

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#00FF00";
    ctx.font = fontSize + "px Arial";

    for(var i = 0; i < columns.length; i++) {
        ctx.fillText(randomMatrixSymbol(), i * fontSize, columns[i] * fontSize);

        if((columns[i] * fontSize) > canvas.height && Math.random() > 0.975) {
            columns[i] = 0;
        }
        columns[i]++;
    }
    drawGameboard(board, canvas, ctx, boardWidth, boardHeight);
}

//--------------------------------------------------------------------------
function randomMatrixSymbol() {
    return String.fromCharCode(Math.floor(
        Math.random() * 26000 + 20000
    ));
}