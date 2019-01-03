class Enemy extends Character {
    constructor(row, pos_x, pos_y, health, moveSpeed, flying) {
        super(row, pos_x, pos_y);
        this.health = health;
        this.moveSpeed = moveSpeed;
        this.flying = flying; // can this enemy type fly over walls?
    }

    //returns boolean value whether enemy can move into that direction on its currents position
    isValidMove(board, direction) {

    }
}

// basic enemy. 1 life, rather slow, can not fly.
class Creep extends Enemy{
    constructor(pos_x, pos_y) {
        super(2 * 16, pos_x, pos_y, 1, 5, false);
    }
}

function enemies(numEnemies) {
    // allEnemies is an array, which at each index saves the enemy object
    // as well as that enemy's current position on the gameboard
    var allEnemies = [];
    for(var i = 0; i < numEnemies; i++) {
        allEnemies.push(new Creep(i + 2, i + 2));
    }
    return allEnemies;
}

// for debugging
function printAllEnemiesStats(enemies) {
    console.log("---------------------------");
    console.log("Enemies:");
    for(var i = 0; i < enemies.length; i++) {
        console.log(`   Enemy ${i}`);
        console.log(`       Health: ${enemies[i].health}`);
        console.log(`       Speed: ${enemies[i].moveSpeed}`);
        console.log(`       Flying: ${enemies[i].flying}`);
    }
    console.log("---------------------------");
}