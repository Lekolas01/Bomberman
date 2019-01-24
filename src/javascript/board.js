
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

let playerinfo_canvas, playerinfo_ctx;

// tileTypes: enum for all types of tile that can exist on the gameboard
let tileTypes = Object.freeze({
	//parameter list: (breakable, passable, x, y)
	"wall": new tile(false, false, 32, 112),
	"empty": new tile(false, true, 32, 0),
	"breakableWall": new tile(true, false, 0, 112)
});


//generates a new map and saves it into board (
//  unbreakable walls on the outside,
//  regular grid structure of unbreakable walls inside,
//  semi-randomly generated breakable walls (= boxes) on the rest (bomberman map))
class gameboard {
	constructor(width, height, numPlayers = 1, numEnemies = 5, boxSpawnChance = 0.3, itemSpawnChance = 1) {
		this.width = width;
		this.height = height;
		this.itemSpawnChance = itemSpawnChance;
		this.data = matrix(this.width, this.height);
		this.enemies = [];
		this.players = [];
		this.morituri = []; //Ave Caesar, morituri te salutant
		this.items = [];
		this.bombs = [];
		this.explosions = [];


		//creates a new matrix of any type
		function matrix(width, height) {
			let matr = new Array(height);
			for (let row = 0; row < height; row++) {
				matr[row] = new Array(width);
			}
			return matr;
		}

		function initOuterWall(board) {
			for (let col = 0; col < width; col++) {
				board.data[0][col] = tileTypes.wall;
				board.data[height - 1][col] = tileTypes.wall;
			}
			for (let row = 0; row < height; row++) {
				board.data[row][width - 1] = tileTypes.wall;
				board.data[row][0] = tileTypes.wall;
			}
		}

		function initGrass(board) {
			for (let row = 1; row < board.height - 1; row++) {
				for (let col = 1; col < board.width - 1; col++) {
					board.data[row][col] = tileTypes.empty;
				}
			}
		}

		function initGridTiles(board) {
			for (let row = 2; row < height - 2; row += 2) {
				for (let col = 2; col < width - 2; col += 2) {
					board.data[row][col] = tileTypes.wall;
				}
			}
		}

		function initPlayers(board) {

			numPlayers = Math.min(4, numPlayers);
			numPlayers = Math.max(0, numPlayers);

			//helper function for initPlayers
			//don't look at it, it's really ugly (works tho)
			function createPlayer(row, col, number) {
				board.data[row][col] = tileTypes.empty; // destroy the potential breakable wall on the position of the player
				board.players.push(new Player(17 + number * 2, row, col, 1));

				const pos = [
					{ diff_y: -1, diff_x: 0 },
					{ diff_y: 0, diff_x: -1 },
					{ diff_y: 1, diff_x: 0 },
					{ diff_y: 0, diff_x: 1 }
				];

				for (let i = 0; i < pos.length; i++) {
					let position = { y: row + pos[i].diff_y, x: col + pos[i].diff_x };
					if (board.data[position.y][position.x] === tileTypes.breakableWall) {
						board.data[position.y][position.x] = tileTypes.empty;
					}
					let position2 = { y: position.y + pos[i].diff_y, x: position.x + pos[i].diff_x };
					if (board.positionExists(position2.y, position2.x)) {
						board.data[position2.y][position2.x] = tileTypes.breakableWall;
					}
				}
			}

			const pos = [
				{ row: 1, col: 1 },					// defines the default starting position of player 1
				{ row: height - 2, col: width - 2 }, // same for player 2, 3 and 4
				{ row: height - 2, col: 1 },
				{ row: 1, col: width - 2 },
			];

			for (let i = 0; i < numPlayers; i++) {
				createPlayer(pos[i].row, pos[i].col, i);
			}

		}

		function initBreakableWalls(board) {
			for (let row = 1; row < board.height - 1; row++) {
				for (let col = 1; col < board.width - 1; col++) {
					if (board.data[row][col] == tileTypes.empty && Math.random() <= boxSpawnChance) {
						board.data[row][col] = tileTypes.breakableWall;
					}
				}
			}
		}

		function initEnemies(board) {
			let startingPositions = board.getAllSpawnableTiles();
			let numStartingPos = startingPositions.length;
			if (numStartingPos == 0) {
				board.data[Math.floor(height / 2)][Math.floor(width / 2)] = tileTypes.empty;
				startingPositions = [{ row: Math.floor(height / 2), col: Math.floor(width / 2) }];
				numStartingPos = 1;
			}

			let nrWitchers = Math.floor(numEnemies * 1 / 8);
			for (let i = 0; i < nrWitchers; i++) {
				let randPos = startingPositions[RandNumInRange(0, numStartingPos)];
				board.enemies.push(new Witcher(randPos.row, randPos.col));
			}

			let nrCreeps = Math.floor((numEnemies - nrWitchers) * 5 / 8);
			for (let i = 0; i < nrCreeps; i++) {
				let randPos = startingPositions[RandNumInRange(0, numStartingPos)];
				board.enemies.push(new Creep(randPos.row, randPos.col));
			}
			for (let i = nrCreeps + nrWitchers; i < numEnemies; i++) {
				let randPos = startingPositions[RandNumInRange(0, numStartingPos)];
				board.enemies.push(new Ghost(randPos.row, randPos.col));
			}
		}

		// this spawns a unique upgrade in the middle of the map
		// it increases all of your stats by 1!! (Each of my stats? This is crazy!)
		function initStarUpgrade(board) {
			board.data[Math.floor(height / 2)][Math.floor(width / 2)] = tileTypes.empty;
			board.data[Math.floor(height / 2) - 1][Math.floor(width / 2)] = tileTypes.breakableWall;
			board.data[Math.floor(height / 2)][Math.floor(width / 2) - 1] = tileTypes.breakableWall;
			board.data[Math.floor(height / 2) + 1][Math.floor(width / 2)] = tileTypes.breakableWall;
			board.data[Math.floor(height / 2)][Math.floor(width / 2) + 1] = tileTypes.breakableWall;
			board.items.push(new Item(Math.floor(height / 2), Math.floor(width / 2), 9));

		}

		initOuterWall(this);
		initGrass(this);
		initGridTiles(this);
		initBreakableWalls(this);
		initPlayers(this);
		initStarUpgrade(this);
		initEnemies(this);
	} // end constructor

	drawGround() {
		for (let row = 0; row < this.data.length; row++) {
			for (let col = 0; col < this.data[0].length; col++) {
				if (this.data[row][col] !== undefined) {
					game_ctx.drawImage(
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

	drawObjects(objects) {
		let animation;

		// if(characterArr.length === 1) console.log(characterArr[0].position.pix_y);
		objects.forEach(object => {
			animation = object.getAnimation(); //The current image of the object the canvas shall draw
			game_ctx.drawImage(
				document.getElementById('art_assets'),
				animation.x, // x pos of art asset (bomb_partyv4.png)
				animation.y, // y pos
				animation.dim_x, // how wide is art asset on png?
				animation.dim_y, // how high is art asset on png?
				object.position.pix_x, // current x axis position of the object in pixels
				object.position.pix_y, // same in y
				animation.animation_size, // how big an object should be drawn(every object has size = 1 tile)
				animation.animation_size
			);
		});
	}

	//draws the gameboard part within the canvas
	draw() {
		//col = x coordinates, row = y
		this.drawGround();
		this.drawObjects(this.morituri);
		this.drawObjects(this.items);
		this.drawObjects(this.bombs);
		this.drawObjects(this.enemies);
		this.drawObjects(this.players);
		this.explosions.forEach(explosion => this.drawObjects(explosion));

	}

	// spawnable means: 
	// no walls or on that tile
	// and no player near it
	getAllSpawnableTiles() {
		let positions = [];
		positions = this.getAllPassableTiles(); // filter out all tiles with walls
		for (let i = 0; i < this.players.length; i++) {
			for (let j = 0; j < positions.length; j++) {
				if (Math.abs(this.players[i].position.row - positions[j].row) <= 1 &&
					Math.abs(this.players[i].position.col - positions[j].col) <= 1) {
					positions.splice(j, 1); // filter all tiles with players near it
					j--;
				}
			}
		}

		for (let i = 0; i < this.items.length; i++) {
			for (let j = 0; j < positions.length; j++) {
				if (this.items[i].position.row == positions[j].row &&
					this.items[i].position.col == positions[j].col) {
					positions.splice(j, 1); // filter all tiles with players near it
					j--;
				}
			}
		}

		return positions;
	}

	// helper function. This returns an array of positions {row, col} on the gameboard where
	// the tiles on those position have are passable set to true
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

	//does this position exist on the gameboard?
	positionExists(row, col) {
		return row >= 0 && this.height > row &&
			col >= 0 && this.width > col;
	}

	addBasicItem(row, col) {
		let itemId = RandNumInRange(0, 3);
		this.items.push(new Item(row, col, itemId));
	}
}


class scoreboard {
	constructor() {

		this.playerScores = [];
		// for(let  i = 0; i < numPlayers; i++) {
		// 	this.playerScores.push(0);
		// }
	}

	draw(ctx, players) {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.font = ctx.font = "30px 'Press Start 2P'";
		ctx.fillStyle = 'white';
		ctx.fillText("SCORES", 60, 55);
		ctx.font = ctx.font = "22px 'Roboto'";
		for (let i = 0; i < players.length; i++) {
			if (players[i] !== undefined) this.playerScores[i] = players[i].score; //update score if player is not dead yet
			ctx.fillText("Player ", 30, 100 + i * 50);
			ctx.fillStyle = this.getFillStyle(i);
			ctx.font = ctx.font = "bold 22px 'Roboto'";
			ctx.fillText(i + 1, 95, 100 + i * 50);
			ctx.font = ctx.font = "22px 'Roboto'";
			ctx.fillStyle = 'white';
			ctx.fillText(`-      ${this.playerScores[i]}`, 130, 100 + i * 50);
		}
	}

	getFillStyle(index) {
		switch (index) {
			case 0:
				return 'blue'
			case 1:
				return 'green'
			case 2:
				return 'red'
			case 3:
				return '#e542f4'
		}
	}

	leadingPlayer() {
		let maxIndex = -1;
		let maxScore = 0;
		for (let i = 0; i < this.playerScores.length; i++) {
			if (maxScore < this.playerScores[i]) {
				maxIndex = i;
				maxScore = this.playerScores[i];
			}
		}
		return maxIndex;
	}
}



class playerinfoboard {
	constructor() {

	}

	draw(ctx, players) {
		// draws the information about 1 player on a given height on the canvas
		function drawPlayerInfo(ctx, player, pos_x, pos_y) {
			function drawAttribute(ctx, color, pos_x, pos_y, chargeRate, asset_x, asset_y) {
				ctx.fillStyle = color;
				ctx.fillRect(pos_x + 35, pos_y + 5,
					ctx.canvas.width * 0.7 * chargeRate, 18);
				ctx.drawImage(
					document.getElementById('art_assets'),
					16 * asset_x,
					16 * asset_y,
					32,
					32,
					pos_x + 10,
					pos_y + 3,
					20,
					20
				);

			}

			//draw strength bar

			drawAttribute(ctx, "red", pos_x, pos_y, player.bombStrength / playerMaxStats.bombStrength, 3, 11);
			drawAttribute(ctx, "blue", pos_x, pos_y + 20, player.maxBombs / playerMaxStats.maxBombs, 0, 11);
			drawAttribute(ctx, "purple", pos_x, pos_y + 40, player.moveSpeed / playerMaxStats.moveSpeed, 6, 11);
		}

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.font = ctx.font = "30px 'Press Start 2P'";
		ctx.fillStyle = 'white';
		ctx.fillText("UPGRADES", 30, 55);
		ctx.font = ctx.font = "22px 'Roboto'";
		for (var i = 0; i < players.length; i++) {
			ctx.fillStyle = "white";
			ctx.fillText(`P${i + 1} `, 10, 130 + i * 90);
			if (players[i] !== undefined) {
				drawPlayerInfo(ctx, players[i], 35, 95 + i * 90);
			}
		}
	}
}