//generates a new map and saves it into board (
//  unbreakable walls on the outside,
//  regular grid structure of unbreakable walls inside,
//  semi-randomly generated breakable walls (= boxes) on the rest (bomberman map))
function gameboard(width, height, boxSpawnChance = 0.3) {
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

    function initBreakableWalls() {
        for (var row = 1; row < height - 1; row++) {
            for (var col = 1; col < width - 1; col++) {
                if (board[row][col] == tileTypes.empty && Math.random() <= boxSpawnChance) {
                    board[row][col] = tileTypes.breakableWall;
                }
            }
        }
    }

    var board = matrix(width, height);
    initOuterWall();
    initGrass();
    initGridTiles();
    initBreakableWalls();
    return board;
}

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
}

function drawCharacters(characterArr, ctx) {
    let animation;
    for (let i = 0; i < characterArr.length; i++) {
        animation = characterArr[i].getAnimation(); //The current image of the character, the canvas shall draw
        ctx.drawImage(document.getElementById('art_assets'),
            animation.x, animation.y, animation.dim_x, animation.dim_y, //animation.x/y: where on asset.png is the image animation.dim_x: how big is it (default: 16px)
            characterArr[i].position.pix_x, characterArr[i].position.pix_y, //where on canvas exactly (in pixels, not tiles) shall the animation be drawn
            tileSize, tileSize); //how big shall the canvas draw the animation (always as big as one tile)
    }
}