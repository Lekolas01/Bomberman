//creates a new matrix of any type
function newMatrix(height, width) {
    var matrix = new Array(height);
    for (var row = 0; row < height; row++) {
        matrix[row] = new Array(width);
    }
    return matrix;
}


//generates a new map and saves it into board (
//  unbreakable walls on the outside,
//  regular grid structure of unbreakable walls inside,
//  semi-randomly generated breakable walls on the rest (google bomberman map))
function initGameboard(board, width, height) {
    function initOuterWall() {
        for (var col = 0; col < width; col++) {
            board[0][col] = tileTypes.wall;
            board[height - 1][col] = tileTypes.wall;
        }
        for (var row = 0; row < height; row++) {
            board[row][width - 1] = tileTypes.wall;
            board[row][0] = tileTypes.wall;
        }
    }

    function initGrass() {
        for (var row = 1; row < height - 1; row++) {
            for (var col = 1; col < width - 1; col++) {
                board[row][col] = tileTypes.empty;
            }
        }
    }

    function initGridTiles() {
        for (var row = 2; row < height - 2; row += 2) {
            for (var col = 2; col < width - 2; col += 2) {
                delete board[row][col];
                board[row][col] = tileTypes.wall;
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
function drawGameboard(data, ctx, width, height) {
    //col = x coordinates, row = y
    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            if (data[row][col] === undefined) {
            } else {
                ctx.drawImage(document.getElementById('art_assets'),
                    data[row][col].x, data[row][col].y, 16, 16, col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}