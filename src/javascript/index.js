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


class tile {
    constructor(breakable, passable, x, y) {
        this.breakable = breakable;
        this.passable = passable;
    // x and y save the position of sprite on png-file
        this.x = x;
        this.y = y
    }
}

let breakable_wall = new tile(true, false);

//create enum for all types of tile that can exist on the gameboard
var tileTypes = Object.freeze({ 
    "wall": new tile(false, false, 160, 64),
    "empty": new tile(false, true, 32, 0),
    "breakable_wall": new tile(true, false, 144, 0),
    "bomb": new tile(false, false, 64, 80)
});

//draws the gameboard part within the canvas
function drawGameboard(data, canvas, ctx, height, width) {
    for(var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if(data[i][j] === undefined) {
                
            } else {
                ctx.drawImage(document.getElementById('art_assets'),
                data[i][j].x, data[i][j].y, 16, 16, i * tileSize, j * tileSize, tileSize, tileSize);
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
    // note: this sometimes throws an error,
    // because the background music loads asynchronously (I think)
    audioBackground.play();
    
    setInterval(animation, 50);
    startGame();
    
}

function startGame() {
    running = true;
    //startView.setAttribute("visibility", "hidden");
    //TODO: init player, generate random map, init monsters
    
    generateGameboard(board, boardWidth, boardHeight);
    
    loopFunctionId = setInterval(loop, SPEED);
}

//generates a random map (
//  unbreakable walls on the outside,
//  regular grid structure of unbreakable walls,
//  semi-randomly generated breakable walls on the rest)
function generateGameboard(board, width, height) {
    function generateOuterWall() {
        for(var i = 0; i < width;  i++) board[0][i]        = tileTypes.wall;
        for(var i = 1; i < height; i++) board[i][0]        = tileTypes.wall;
        for(var i = 1; i < height; i++) board[i][width-1]  = tileTypes.wall;
        for(var i = 1; i < width;  i++) board[height-1][i] = tileTypes.wall;
    }
    function generateGridTiles() {
        for(var i = 2; i < height - 2; i+= 2) {
            for(var j = 2; j < width - 2; j+= 2) {
                delete board[i][j];
                board[i][j] = tileTypes.wall;
            }
        }
    }
    function generateGrass() {
        for(var i = 1; i < height - 1; i++) {
            for (var j = 1; j < width - 1; j++) {
                if((i % 2 != 0) || (j % 2 != 0)) {
                    delete board[i][j]; //avoid memory corpses
                    board[i][j] = tileTypes.empty;
                }
            }
        }
    }
    function generateBoxes() {
        //TODO: generate breakable walls at some parts of the grass
    }

    generateOuterWall();
    generateGrass();
    generateGridTiles();
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