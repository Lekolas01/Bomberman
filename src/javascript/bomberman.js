
var canvas, ctx;
var fontSize = 18; //for matrix anim

var GAME_SPEED = 9; // 1 tick every 50 ms
//game logic variables
var boardWidth = 17; // how many tiles is the gameboard wide?
var boardHeight = 13 // how many tiles is the gameboard high?
var tileSize = 40; // how big is one tile? (width and height)
var score = 0;
var audioLayBomb, audioBombExplode, audioBackground, audioDeath, audioGameOver;


var board; // board: saves the information about the current gameboard
var enemies; // enemies: saves the information about all currently living enemies

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

    let width =   boardWidth * tileSize;
    let height =  boardHeight * tileSize;
    ctx.canvas.width  = width;
    ctx.canvas.height = height;
    canvas.width = width;
    canvas.height = height;


    //background music
    // note: sometimes background music doesn't play,
    // because the background music loads asynchronously
    audioBackground = new Audio("../sound/background.mp3");
    audioBackground.loop = true;
    //audioBackground.play();
    
    startGame();
}

function startGame() {
    running = true;
    //startView.setAttribute("visibility", "hidden");
    //TODO: init player, init monsters
    
    board = gameboard(boardWidth, boardHeight);
    enemies = enemies(6);
    printAllEnemiesStats(enemies);
    
    renderIntervalId = setInterval(loop, GAME_SPEED);
}

// is called every 50 ms
function loop() {
    frame_cnt = (frame_cnt + 1) % 120;
    //TODO:
        //move enemies
        //move bomberman
        //bombs tick
    drawScreen();
}

//--------------------------------------------------------------------------
function drawScreen() {
    drawGameboard(board, ctx);
    drawEnemies(enemies, ctx);
    //drawBomberman();
}