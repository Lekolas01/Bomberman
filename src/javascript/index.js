/*var boardLogic = document.createElement('script');
boardLogic.src = 'boardLogic';
document.head.appendChild(boardLogic); */

var canvas, ctx;
var fontSize = 18;

var columns = new Array();
var boardWidth = 20; // initial length of the gameboard
var boardHeight = 16; // initial height of the gameboard
var board = newMatrix(boardHeight, boardWidth);


//draws the gameboard part within the canvas
function drawGameboard(data, canvas, ctx, height, width) {
    for(var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if(data[i][j] === undefined) {
                ctx.drawImage(document.getElementById('art_assets'),
                33, 71, 104, 124, 21, 20, 87, 104);
            } else {
                console.log("DEFINED");
            }
        }
    }
}

//--------------------------------------------------------------------------
window.onload = function(){
    canvas = document.getElementById("bomberman");
    ctx = canvas.getContext("2d");
    initializeAnimation();

    window.onresize = initializeAnimation;

    setInterval(animation, 50);

}

//--------------------------------------------------------------------------
function initializeAnimation() {
	  // set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var numberOfColumns = Math.round(canvas.width / fontSize);
    columns = new Array();
    for (var i = 0; i < numberOfColumns; i++) {
        columns[i] = canvas.height;
    }

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