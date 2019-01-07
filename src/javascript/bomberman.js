
var canvas, ctx;
var fontSize = 18; //for matrix anim

//game logic variables
var GAME_SPEED = 9; // 1 tick every 9 ms
var boardWidth = 17; // how many tiles is the gameboard wide?
var boardHeight = 13 // how many tiles is the gameboard high?
var tileSize = 40; // how big is one tile? (width and height)
var score = 0;
var audioLayBomb, audioBombExplode, audioBackground, audioDeath, audioGameOver;
var KEY = { W: 87, A: 65, S: 83, D: 68, B: 66, Q: 81, SPACE: 32, RIGHT: 39, UP: 38, LEFT: 37, DOWN: 40, NONE: -1 };
var currently_pressed = []; //keeps track of all relevant keys that are currently pressed
var DIRECTION = { UP: "UP", DOWN: "DOWN", LEFT: "LEFT", RIGHT: "RIGHT" };


var board; // board: saves the information about the current gameboard
var enemies; // enemies: saves the information about all currently living enemies
var player;
var items = [];
var explosions = [];
var dyingChars = []; //contains all characters, that have to be animated as "dying" (blinking, then vanishing)

var running = false; // game currently on?

//--------------------------------------------------------------------------
window.onload = function () {
    canvas = document.getElementById("game_canvas");
    ctx = canvas.getContext("2d");

    let width = boardWidth * tileSize;
    let height = boardHeight * tileSize;
    ctx.canvas.width = width;
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
    player = new Player(4, 1, 1, 3, 3);
    enemies = enemies(board, 20);
    printAllEnemiesStats(enemies);

    //add key listeners for player controls
    window.onkeydown = playerControlPressed;
    window.onkeyup = playerControlReleased;

    renderIntervalId = setInterval(loop, GAME_SPEED);

}
function playerControlPressed(event) {
    var key = event.keyCode ? event.keyCode : event.which;

    switch (key) {
        case KEY.DOWN:
        case KEY.UP:
        case KEY.RIGHT:
        case KEY.LEFT:
            currently_pressed[key] = true; //mark that key has been pressed
            player.lastKeyInput = key;
            break;
    }
}

function playerControlReleased(event) {
    var key = event.keyCode ? event.keyCode : event.which;

    switch (key) {
        case KEY.DOWN:
        case KEY.UP:
        case KEY.RIGHT:
        case KEY.LEFT:
            currently_pressed[key] = false; //mark that key is no longer pressed
            if (player.lastKeyInput === key) { //if released key was the last pressed key
                if (currently_pressed.filter(_key => _key).length === 0) { //we have to check, if there is any other (relevant) key pressed
                    player.lastKeyInput = KEY.NONE; //if not, players input is set to none
                } else {
                    player.lastKeyInput = currently_pressed.indexOf(true); //else, we get (one of) the other pressed key(s)
                }

            }
            break;
        case KEY.B:
            player.holdsBomb = true;
            break;
    }
}

// is called every 50 ms
function loop() {
    movePlayer();
    moveEnemies();
    drawScreen();

}

function movePlayer() {
    let pix_offset = 0;
    let frame_cnt = 0;
    player.updateFrameCnt()
    frame_cnt = player.frame_cnt;
    if (frame_cnt === 0) {
        if(player.holdsBomb) player.plantBomb();

        player.updateDirection();
        player.tryMove(board);
        player.refreshPos();
    }
    pix_offset = tileSize - ((tileSize / player.speed) * (frame_cnt % player.speed) + 1);
    player.refreshPixelPos(pix_offset);
}

function moveEnemies() {
    let pix_offset = 0;
    let frame_cnt = 0;
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].updateFrameCnt()
        frame_cnt = enemies[i].frame_cnt;
        if (frame_cnt === 0) {
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
    drawItems(items);
    explosions.forEach(explosion => drawItems(explosion));
    drawCharacters(enemies, ctx);
    drawCharacters([player], ctx);
}