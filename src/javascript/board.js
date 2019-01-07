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
    "wall": new tile(false, false, 96, 0),
    "empty": new tile(false, true, 32, 0),
    "breakableWall": new tile(true, false, 144, 0),
    "bomb": new tile(false, false, 64, 80)
});


//generates a new map and saves it into board (
//  unbreakable walls on the outside,
//  regular grid structure of unbreakable walls inside,
//  semi-randomly generated breakable walls (= boxes) on the rest (bomberman map))
class gameboard {
	constructor(width, height, numEnemies = 5, boxSpawnChance = 0.3) {
		this.width = width;
		this.height = height;
        this.data = matrix(this.width, this.height);
        this.enemies = [];
        this.items = [];
        this.explosions = [];
        this.player = new Player(4, 1, 1, 3, 3);

		//creates a new matrix of any type
		function matrix(width, height) {
			var matr = new Array(height);
			for (var row = 0; row < height; row++) {
				matr[row] = new Array(width);
			}
			return matr;
		}

		function initOuterWall(board) {
			for (var col = 0; col < width; col++) {
				board.data[0][col] = tileTypes.wall;
				board.data[height - 1][col] = tileTypes.wall;
			}
			for (var row = 0; row < height; row++) {
				board.data[row][width - 1] = tileTypes.wall;
				board.data[row][0] = tileTypes.wall;
			}
		}

		function initGrass(board) {
			for (var row = 1; row < board.height - 1; row++) {
				for (var col = 1; col < board.width - 1; col++) {
					board.data[row][col] = tileTypes.empty;
				}
			}
		}

		function initGridTiles(board) {
			for (var row = 2; row < height - 2; row += 2) {
				for (var col = 2; col < width - 2; col += 2) {
					delete board.data[row][col];
					board.data[row][col] = tileTypes.wall;
				}
			}
		}

		function initBreakableWalls(board) {
			for (var row = 1; row < board.height - 1; row++) {
				for (var col = 1; col < board.width - 1; col++) {
					if (board.data[row][col] == tileTypes.empty && Math.random() <= boxSpawnChance) {
						board.data[row][col] = tileTypes.breakableWall;
					}
				}
			}
		}

		function initEnemies(board) {
			var startingPositions = board.getAllPassableTiles();
            var numStartingPos = startingPositions.length;
			for (var i = 0; i < numEnemies; i++) {
				var randPos = startingPositions[RandNumInRange(0, numStartingPos)];
				board.enemies.push(new Enemy(1 * 16, randPos.row, randPos.col, 1, 0.1 * i + 0.3, false));
            }
		}

		initOuterWall(this);
		initGrass(this);
		initGridTiles(this);
        initBreakableWalls(this);
        initEnemies(this);
    }
    
    drawGround() {
        for (var row = 0; row < this.data.length; row++) {
			for (var col = 0; col < this.data[0].length; col++) {
				if (this.data[row][col] !== undefined) {
					ctx.drawImage(
						document.getElementById('art_assets'),
						this.data[row][col].x,
						this.data[row][col].y,
						16,
						16,
						col * tileSize,
						row * tileSize,
						tileSize,
						tileSize
					);
				}
			}
		}
    }

    drawCharacters(characterArr, ctx) {
        let animation;

       // if(characterArr.length === 1) console.log(characterArr[0].position.pix_y);
        for (let i = 0; i < characterArr.length; i++) {
            animation = characterArr[i].getAnimation(); //The current image of the character, the canvas shall draw
            ctx.drawImage(
                document.getElementById('art_assets'),
                animation.x, // x pos of art asset (bomb_partyv4.png)
                animation.y, // y pos
                animation.dim_x, // how wide is art asset on png?
                animation.dim_y, // how high is art asset on png?
                characterArr[i].position.pix_x, // current x axis position of the character in pixels
                characterArr[i].position.pix_y, // same in y
                tileSize, // how big an enemy should be drawn(every characters has size = 1 tile)
                tileSize
            );
        }
    }

    drawItems(items, ctx) {
        let animation;
        items.forEach(item => {
            animation = item.getAnimation();
            ctx.drawImage(
                document.getElementById('art_assets'),
                animation.x,
                animation.y,
                16,
                16,
                item.pos_x,
                item.pos_y,
                animation.dim_x,
                animation.dim_y
            );
        });
    }

	//draws the gameboard part within the canvas
	draw(ctx) {
        //col = x coordinates, row = y
        this.drawGround();
        this.drawCharacters(this.enemies, ctx);
        this.drawCharacters([this.player], ctx);
        this.drawItems(this.items, ctx);
        this.explosions.forEach(explosion => this.drawItems(explosion, ctx));
		
	}

	// helper function. This returns an array of positions {row, col} on the gameboard where
	// the tiles on those position all are passable set to true
	getAllPassableTiles() {
		let positions = [];
		for (let row = 0; row < this.height; row++) {
			for (let col = 0; col < this.width; col++) {
				if (this.data[row][col].passable) {
					positions.push({ row, col });
				}
			}
		}
		return positions;
	}
}
