// helper function returns a random integer between start and (end - 1)
function RandNumInRange(start, end) {
	return Math.floor(Math.random() * (end - start)) % (end - start);
}

class Enemy extends Character {
	constructor(row, pos_x, pos_y, health, moveSpeed, flying) {
		super(moveSpeed, row, pos_x, pos_y);
		this.health = health;
		this.flying = flying; // can this enemy type fly over walls?
	}

	//returns boolean value whether enemy can move into that direction on its currents position
	isValidMove(board, direction) {
		//console.log("isValidMove:");
		//console.log(board === undefined);
		var diff_x, diff_y;
		switch (direction) {
			case DIRECTION.UP:
				diff_y = -1;
				diff_x = 0;
				break;
			case DIRECTION.DOWN:
				diff_y = 1;
				diff_x = 0;
				break;
			case DIRECTION.RIGHT:
				diff_y = 0;
				diff_x = 1;
				break;
			case DIRECTION.LEFT:
				diff_y = 0;
				diff_x = -1;
				break;
		}

		// check for out of bounds, for more robust code
		if (
			typeof board.data[this.position.row + diff_y] !== 'undefined' &&
			typeof board.data[this.position.row + diff_y][this.position.col + diff_x] !== 'undefined'
		) {
			return board.data[this.position.row + diff_y][this.position.col + diff_x].passable || this.flying;
		} else {
			return false;
		}
	}

	//returns the number of valid directions this enemy can move to
	numValidDirections(board) {
		var count = 0;

		//console.log("numValidDirections");
		//console.log(board === undefined);
		if (this.isValidMove(board, DIRECTION.UP)) count++;
		if (this.isValidMove(board, DIRECTION.DOWN)) count++;
		if (this.isValidMove(board, DIRECTION.RIGHT)) count++;
		if (this.isValidMove(board, DIRECTION.LEFT)) count++;
		return count;
	}

	// wählt eine zufällig valide gültige Bewegungsrichtung aus.
	// Wenn keine existiert, wird idle auf true gesetzt.
	chooseMovingDirection(board) {
		let numDirections = this.numValidDirections(board);
		if (numDirections == 0) {
			// existiert keine valide Richtung -> idle = true
			this.idle = true;
		} else {
			// sonst wähle eine der validen Richtungen aus
			this.idle = false;
			let randDir = RandNumInRange(0, 4); //zufällige "Richtung"
			while (!this.isValidMove(board, this.intToDir(randDir))) {
				// solange Richtung invalid
				randDir = RandNumInRange(0, 4); // suche neue zufällige Richtung aus
			}
			this.move(this.intToDir(randDir));
		}
	}
}

// basic enemy. 1 life, rather slow, can not fly.
class Creep extends Enemy {
	constructor(pos_x, pos_y) {
		super(1 * 16, pos_x, pos_y, 1, 0.5, false);
	}
}

// this function generates num Enemies on the gameboard an saves all of them within an array
// their starting position is randomly selected from all valid positions on the gameboard
function enemies(board, num) {
	// allEnemies is an array, which at each index saves the enemy object
	// as well as that enemy's current tile position on the gameboard
	var startingPositions = board.getAllPassableTiles();
	var numStartingPos = startingPositions.length;
	var allEnemies = [];
	for (var i = 0; i < num; i++) {
		var randPos = startingPositions[RandNumInRange(0, numStartingPos)];
		console.log(`randPos: ${randPos.row} ${randPos.col}`);
		allEnemies.push(new Enemy(1 * 16, randPos.row, randPos.col, 1, 0.1 * i + 0.3, false));
	}
	return allEnemies;
}

function printEnemyStats(enemy) {
	console.log(`       Health: ${enemy.health}`);
	console.log(`       Speed: ${enemy.moveSpeed}`);
	console.log(`       Flying: ${enemy.flying}`);
}

// for debugging
function printAllEnemiesStats(enemies) {
	console.log('---------------------------');
	console.log('Enemies:');
	for (var i = 0; i < enemies.length; i++) {
		console.log(`   Enemy ${i}`);
		printEnemyStats(enemies[i]);
	}
	console.log('---------------------------');
}
