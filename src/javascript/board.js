//generates a new map and saves it into board (
//  unbreakable walls on the outside,
//  regular grid structure of unbreakable walls inside,
//  semi-randomly generated breakable walls (= boxes) on the rest (bomberman map))
function gameboard(width, height, boxSpawnChance = 0.7) {
    //creates a new matrix of any type
    function matrix(width, height) {
        var matr = new Array(height);
        for (var row = 0; row < height; row++) {
            matr[row] = new Array(width);
        }
        return matr;
    }

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
    
    function initBoxes() {
        for (var row = 1; row < height - 1; row ++) {
            for (var col = 1; col < width - 1; col ++) {
                if(board[row][col] == tileTypes.empty && Math.random() <= boxSpawnChance) {
                    board[row][col] = tileTypes.breakableWall;
                }
            }
        }
    }
    
    var board = matrix(width, height);
    initOuterWall();
    initGrass();
    initGridTiles();
    initBoxes();
    return board;
}



let bomberman = new Character(4, 0);
let bomberman2 = new Character(3, 1);
let bomberman3 = new Character(2, 2);
var cnt = 12;

//draws the gameboard part within the canvas
function drawGameboard(data, ctx) {
    //col = x coordinates, row = y
    for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[0].length; col++) {
            if (data[row][col] === undefined) {
            } else {
                ctx.drawImage(document.getElementById('art_assets'),
                    data[row][col].x, data[row][col].y, 16, 16, col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }

    
    let animation2 = bomberman2.getAnimation("down");
    ctx.drawImage(document.getElementById('art_assets'),
        animation2.x, animation2.y, 16, 16, 1 * tileSize, (cnt / 12) * tileSize, tileSize, tileSize);

    let animation3 = bomberman3.getAnimation("right");
    ctx.drawImage(document.getElementById('art_assets'),
        animation3.x, animation3.y, 16, 16, 3 * tileSize, (cnt / 12) * tileSize, tileSize, tileSize);

    let animation = bomberman.getAnimation("up");
    ctx.drawImage(document.getElementById('art_assets'),
        animation.x, animation.y, 16, 16, 5 * tileSize, (cnt / 12) * tileSize, tileSize, tileSize);

}