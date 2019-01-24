// helper function returns a random integer between start and (end - 1)
function RandNumInRange(start, end) {
    return Math.floor(Math.random() * (end - start)) % (end - start);
}

class Enemy extends Character {
    constructor(rowOnAsset, board_row, board_col, health, moveSpeed, flying, pointsWhenKilled = 15) {
        super(moveSpeed, rowOnAsset, board_row, board_col, pointsWhenKilled);
        this.health = health;
        this.flying = flying; // can this enemy type fly over walls?
    }

    //returns boolean value whether enemy can move into that direction on its currents position
    isValidMove(board, direction) {
        let row = this.position.row;
        let col = this.position.col;
        switch (direction) {
            case DIRECTION.UP:
                row -= 1;
                break;
            case DIRECTION.DOWN:
                row += 1;
                break;
            case DIRECTION.RIGHT:
                col += 1;
                break;
            case DIRECTION.LEFT:
                col -= 1;
                break;
        }

        // check for out of bounds, for more robust code
        if (typeof board.data[row] !== 'undefined' &&
            typeof board.data[row][col] !== 'undefined') {
            return board.data[row][col].passable || (this.flying && board.data[row][col] !== tileTypes.wall);
        } else {
            return false;
        }
    }

    //returns the number of valid directions this enemy can move to
    numValidDirections(board) {
        let count = 0;

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
            let randDir = RandNumInRange(0, 6); //zufällige "Richtung"
            while (!this.isValidMove(board, this.intToDir(randDir))) {
                // solange Richtung invalid
                randDir = RandNumInRange(0, 5); // suche neue zufällige Richtung aus
            }
            this.move(this.intToDir(randDir));
        }
    }

    //checks if a player and an enemy have collided. player loses life in that scenario
    kill() {
        //calc size of hitbox (- a treshold)
        let mx_left = this.position.pix_x + 0.25 * tileSize;
        let mx_right = mx_left + tileSize - 0.25 * tileSize;
        let my_up = this.position.pix_y + 0.25 * tileSize;
        let my_down = my_up + tileSize - 0.25 * tileSize;

        //same for players
        let px_left;
        let px_right;
        let py_up;
        let py_down;
        board.players.forEach(player => {
            px_left = player.position.pix_x + 0.25 * tileSize;
            px_right = px_left + tileSize - 0.25 * tileSize;
            py_up = player.position.pix_y + 0.25 * tileSize;
            py_down = py_up + tileSize - 0.25 * tileSize;

            //check if hitboxes overlap
            //When monsters left edge is to the left of players right side
            //and at the same time the monsters right side is not totaly left of players left side
            //When at the same time the montsters upper bond is below the player's lower bound
            //but the monsters lower bound is higher than the players upper bound, then they overlap
            if (mx_left < px_right && mx_right > px_left &&
                my_up < py_down && my_down > py_up) {
                player.die();
            }
        });
    }

    die() {
        if (board.enemies.filter(enemy => enemy === this).length > 0) {
            board.enemies.forEach(enemy => {
                if (enemy === this) board.addBasicItem(enemy.position.row, enemy.position.col);
            });
            board.enemies = board.enemies.filter(enemy => enemy != this);
            super.die();
        }
    }

}

//flying, but slow
class Ghost extends Enemy {
    constructor(board_row, board_col) {
        super(16, board_row, board_col, 1, 0.30, true, 60);

        this.directions = new Array(2);

        //up and right
        this.direction[0] = new Array(8);
        this.direction[0][0] = new AnimationFrame(0, 25 * 16, 48, 48);
        this.direction[0][1] = new AnimationFrame(64, 25 * 16, 48, 48);
        this.direction[0][2] = new AnimationFrame(129, 25 * 16, 48, 48);
        this.direction[0][3] = new AnimationFrame(194, 25 * 16, 48, 48);
        this.direction[0][4] = new AnimationFrame(0, 29 * 16, 48, 48);
        this.direction[0][5] = new AnimationFrame(66, 29 * 16, 48, 48);
        this.direction[0][6] = new AnimationFrame(130, 29 * 16, 48, 48);
        this.direction[0][7] = new AnimationFrame(195, 29 * 16, 48, 48);

        //down and left
        this.direction[1] = new Array(8);
        this.direction[1][0] = new AnimationFrame(0, 36 * 16, 48, 48);
        this.direction[1][1] = new AnimationFrame(64, 36 * 16, 48, 48);
        this.direction[1][2] = new AnimationFrame(129, 36 * 16, 48, 48);
        this.direction[1][3] = new AnimationFrame(194, 36 * 16, 48, 48);
        this.direction[1][4] = new AnimationFrame(0, 40 * 16, 48, 48);
        this.direction[1][5] = new AnimationFrame(66, 40 * 16, 48, 48);
        this.direction[1][6] = new AnimationFrame(130, 40 * 16, 48, 48);
        this.direction[1][7] = new AnimationFrame(195, 40 * 16, 48, 48);
    }

    move(movement) {
        if (this.frame_cnt % 5 === 0) {
            //every 5th frame, a new animation image is shown
            this.tick += 1; //counts next animation
        }

        if (this.tick === 13) this.tick = 0;

        if (movement !== this.last_direction) {
            //direction changed
            this.tick = 1; // 0 would be idle, 1 is first moving motion
        }

        this.last_direction = movement; //save the direction, the character is heading
        let face = 1;
        if (this.last_direction === DIRECTION.UP || this.last_direction === DIRECTION.RIGHT) {
            face = 0;
        }
        return this.direction[face][this.tick % 8];
    }

    getIdle() {
        let face = 1;
        if (this.last_direction === DIRECTION.UP || this.last_direction === DIRECTION.RIGHT) {
            face = 0;
        }
        return this.direction[face][0];
    }
}

// basic enemy. 1 life, rather slow, can not fly.
class Creep extends Enemy {
    constructor(board_row, board_col) {
        super(1 * 16, board_row, board_col, 1, 0.5, false, 20);
    }
}

// Becomes a Ghost when dying.
class Witcher extends Enemy {
    constructor(board_row, board_col) {
        super(9 * 16, board_row, board_col, 1, 0.75, false, 40);
    }

    die() {
        if (board.enemies.filter(enemy => enemy === this).length > 0) {
            setTimeout(function (ghost) {
                board.enemies.push(ghost);
            }, 1500 * 17 / GAME_SPEED, new Ghost(this.position.row, this.position.col)); //witcher becomes Ghost after dying animation is finished
            super.die();
        }
    }
}

// this function generates num Enemies on the gameboard an saves all of them within an array
// their starting position is randomly selected from all valid positions on the gameboard
function enemies(board, num) {
    // allEnemies is an array, which at each index saves the enemy object
    // as well as that enemy's current tile position on the gameboard
    let startingPositions = board.getAllPassableTiles();
    let numStartingPos = startingPositions.length;
    let allEnemies = [];
    for (let i = 0; i < num; i++) {
        let randPos = startingPositions[RandNumInRange(0, numStartingPos)];
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
    for (let i = 0; i < enemies.length; i++) {
        console.log(`   Enemy ${i}`);
        printEnemyStats(enemies[i]);
    }
    console.log('---------------------------');
}
