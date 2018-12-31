
var canvas, ctx;
var fontSize = 18; //for matrix anim

var GAME_SPEED = 50; // 1 tick every 50 ms

//game logic variables
var boardWidth = 20; // how many tiles is the gameboard wide?
var boardHeight = 20; // how many tiles is the gameboard high?
var tileSize = 16; // how big is one tile? (width and height)
var score = 0;
var audioLayBomb, audioBombExplode, audioBackground, audioDeath, audioGameOver;
// borad: saves the information about the current gameboard
var board = newMatrix(boardHeight, boardWidth); 

var running = false; // game currently on?

// tile: equals one cell on a bomberman map(1 wall, 1 grass etc.)
class tile {
    constructor(breakable, passable, x, y) {
        this.breakable = breakable;
        this.passable = passable;
    // x and y save the position of sprite on png-file (not pretty)
        this.x = x;
        this.y = y
    }
}

// tileTypes: enum for all types of tile that can exist on the gameboard
var tileTypes = Object.freeze({ 
    //parameter list: (breakable, passable, x, y)
    "wall":         new tile(false, false, 160, 64),
    "empty":        new tile(false, true, 32, 0),
    "breakableWall":new tile(true, false, 144, 0),
    "bomb":         new tile(false, false, 64, 80)
});

//--------------------------------------------------------------------------
window.onload = function(){
    canvas = document.getElementById("game_canvas");
    ctx = canvas.getContext("2d");

    //background music
    // note: sometimes background music doesn't play,
    // because the background music loads asynchronously
    audioBackground = new Audio("../sound/background.mp3");
    audioBackground.loop = true;
    audioBackground.play();
    
    startGame();
}

function startGame() {
    running = true;
    //startView.setAttribute("visibility", "hidden");
    //TODO: init player, init monsters
    
    initGameboard(board, boardWidth, boardHeight);
    
    setInterval(loop, GAME_SPEED);
}

// is called every 50 ms
function loop() {
    console.log("loop");
    //TODO:
        //move enemies
        //move bomberman
        //bombs tick
    drawScreen();
}

//--------------------------------------------------------------------------
function drawScreen() {
    drawGameboard(board, canvas, ctx, boardWidth, boardHeight);
    //drawEnemies();
    //drawBomberman();
}