
var canvas, ctx;
var fontSize = 18; //for matrix anim

//game logic variables
var GAME_SPEED = 9; // 1 tick every 9 ms
var boardWidth = 17; // how many tiles is the gameboard wide?
var boardHeight = 13 // how many tiles is the gameboard high?
var tileSize = 40; // how big is one tile? (width and height)
var score = 0;
var audioLayBomb, audioBombExplode, audioBackground, audioDeath, audioGameOver;


var board; // board: saves the information about the current gameboard
var enemies; // enemies: saves the information about all currently living enemies

var running = false; // game currently on?

let bomb = new Bomb(4,5,6);

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
    "wall":         new tile(false, false, 96, 0),
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
    
    board = new gameboard(boardWidth, boardHeight);
    enemies = enemies(board, 20);
    printAllEnemiesStats(enemies);
    
    renderIntervalId = setInterval(loop, GAME_SPEED);
    
}

// is called every 50 ms
function loop() {


    moveEnemies();
    //TODO:
        //move enemies / moveCharacters()
        //move bomberman
        //bombs tick
    drawScreen();
    drawItems(bomb);
}

function moveEnemies(){
    let pix_offset = 0;
    let frame_cnt = 0;
    for(let i = 0; i < enemies.length; i++){
            enemies[i].updateFrameCnt()
            frame_cnt = enemies[i].getFrameCount();
           if(frame_cnt === 0){
                enemies[i].chooseMovingDirection(board);
                enemies[i].refreshPos(); // change position in Matrix (row, col)
           }
           pix_offset = tileSize - ((tileSize / enemies[i].speed) * (frame_cnt % enemies[i].speed) + 1); //in MOVEMENT_SPEED frames (eg. 60 Frames) character moves 1 Tile. 
           //So Every Frame, we add 1/60 of a tile to the current moving direction
           //This way, the characters position changes 60/60  (= whole tile) of a tile in the whole 60 frames
           enemies[i].refreshPixelPos(pix_offset);
    }
}

//--------------------------------------------------------------------------
function drawScreen() {
    board.draw(ctx);
    drawCharacters(enemies, ctx);
}