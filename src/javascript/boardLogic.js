//creates a new matrix of any type
function newMatrix(height, width) {
    var x = new Array(height);
    for(var i = 0; i < width; i++) {
        x[i] = new Array(width);
    }
    return x;
}  


//generates a new map and saves it into board (
//  unbreakable walls on the outside,
//  regular grid structure of unbreakable walls inside,
//  semi-randomly generated breakable walls on the rest (google bomberman map))
function initGameboard(board, width, height) {
    function initOuterWall() {
        for(var i = 0; i < width;  i++) board[0][i]        = tileTypes.wall;
        for(var i = 1; i < height; i++) board[i][0]        = tileTypes.wall;
        for(var i = 1; i < height; i++) board[i][width]  = tileTypes.wall;
        for(var i = 1; i < width;  i++) board[height][i] = tileTypes.wall;
    }
    function initGridTiles() {
        for(var i = 2; i < height - 2; i+= 2) {
            for(var j = 2; j < width - 2; j+= 2) {
                delete board[i][j];
                board[i][j] = tileTypes.wall;
            }
        }
    }
    function initGrass() {
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

    initOuterWall();
    initGrass();
    initGridTiles();
}


//draws the gameboard part within the canvas
function drawGameboard(data, canvas, ctx, height, width) {
    for(var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if(data[i][j] === undefined) {
                
            } else {
                ctx.drawImage(document.getElementById('art_assets'),
                data[i][j].x, data[i][j].y, 16, 16, i * tileSize / 2, j * tileSize / 2, tileSize/ 2, tileSize/ 2);
            }
        }
    }
}