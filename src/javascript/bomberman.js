
var canvas, ctx;
var fontSize = 18; //for matrix anim

let frame_cnt = 0;
var GAME_SPEED = 9; // 1 tick every 9 ms
let MOVEMENT_SPEED = 60; //Every 60 frames, characters can move 1 Tile (indirect propotional: Higher Number = slower)
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
    
    board = gameboard(boardWidth, boardHeight);
    enemies = enemies(8);
    enemies[0].last_directions = "down";
    printAllEnemiesStats(enemies);
    
    renderIntervalId = setInterval(loop, GAME_SPEED);
}

// is called every 50 ms
function loop() {
    frame_cnt = (frame_cnt + 1) % MOVEMENT_SPEED; //frame_cnt will be between 0 and MOVEMENT_SPEED - 1
    //ToDo: Move to "moveCharacters()"
    if(frame_cnt === 0){ //If we Are in the 1st frame, Change Direction and/or Move Characters in Matrix
        for(let i = 0; i < enemies.length; i++){
            if (enemies[i].last_direction === "down" && enemies[i].position.row >= boardHeight - 2) { //when we are moving down and are in the last row, change direction
                enemies[i].move("right");
                if(i === 3) enemies[0].idle = !enemies[0].idle; //idle showcase. when set to idle character will not move. If idle is reset to false, then character moves again.
            }
            if(enemies[i].last_direction === "right" &&  enemies[i].position.col >= boardWidth - 2) {
                enemies[i].move("up");
            }
            if(enemies[i].last_direction === "up" && enemies[i].position.row <= 1){
                enemies[i].move("left");
                if(i === 3) enemies[0].idle = !enemies[0].idle;
            }
            if(enemies[i].last_direction === "left" && enemies[i].position.col <= 1) {
                enemies[i].move("down");
            }
            enemies[i].refreshPos(); // change position in Matrix (row, col)
        }
    }
    let pix_offset = tileSize - ((tileSize / MOVEMENT_SPEED) * ((frame_cnt % MOVEMENT_SPEED) + 1)); //in MOVEMENT_SPEED frames (eg. 60 Frames) character moves 1 Tile. 
                                                                                            //So Every Frame, we add 1/60 of a tile to the current moving direcction
                                                                                            //This way, the characters position changes 60/60  (= whole tile) of a tile in the whole 60 frames
    for(let i = 0; i < enemies.length; i++){
        enemies[i].refreshPixelPos(pix_offset); //based on direction, pix_offset is added to or subtracted from dim_x or dim_y
    }
    //TODO:
        //move enemies / moveCharacters()
        //move bomberman
        //bombs tick
    drawScreen();
}

//--------------------------------------------------------------------------
function drawScreen() {
    drawGameboard(board, ctx);
    drawCharacters(enemies, ctx);
    //drawBomberman();
}