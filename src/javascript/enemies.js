// helper function returns a random integer between start and (end - 1)
function RandNumInRange(start, end) {
    return Math.floor(Math.random() * (end - start)) % (end - start);
}

class Enemy extends Character {
    constructor(rowOnAsset, pos_x, pos_y, health, moveSpeed, flying, pointsWhenKilled = 15) {
        super(moveSpeed, rowOnAsset, pos_x, pos_y, pointsWhenKilled);
        this.health = health;
        this.flying = flying; // can this enemy type fly over walls?
    }

    //returns boolean value whether enemy can move into that direction on its currents position
    isValidMove(board, direction) {
        //console.log("isValidMove:");
        //console.log(board === undefined);
        let  diff_x, diff_y;
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
        let  count = 0;

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

    //checks if a player and an enemy have collided. player loses life in that scenario
    kill(){
        //calc size of hitbox (- a treshold)
        let mx_left = this.position.pix_x + 0.2 * tileSize;
        let mx_right = mx_left + tileSize - 0.2 * tileSize;
        let my_up = this.position.pix_y + 0.2 * tileSize;
        let my_down = my_up + tileSize - 0.2 * tileSize;

        //same for players
        let px_left;
        let px_right;
        let py_up;
        let py_down;
        board.players.forEach(player => {
            px_left = player.position.pix_x + 0.2 * tileSize;
            px_right = px_left + tileSize - 0.2 * tileSize;
            py_up = player.position.pix_y + 0.2 * tileSize;
            py_down = py_up + tileSize - 0.2 * tileSize;

            //check if hitboxes overlap
            //When monsters left edge is to the left of players right side
            //and at the same time the monsters right side is not totaly left of players left side
            //When at the same time the montsters upper bond is below the player's lower bound
            //but the monsters lower bound is higher than the players upper bound, than they overlap
            if (mx_left < px_right && mx_right > px_left &&
                my_up < py_down && my_down > py_up){
                    player.die();
                }            
        });
    }

    die() {
        if (board.enemies.filter(enemy => enemy === this).length > 0) {
            board.enemies = board.enemies.filter(enemy => enemy != this);
            super.die();
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
    let  startingPositions = board.getAllPassableTiles();
    let  numStartingPos = startingPositions.length;
    let  allEnemies = [];
    for (let  i = 0; i < num; i++) {
        let  randPos = startingPositions[RandNumInRange(0, numStartingPos)];
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
    for (let  i = 0; i < enemies.length; i++) {
        console.log(`   Enemy ${i}`);
        printEnemyStats(enemies[i]);
    }
    console.log('---------------------------');
}
