class Enemy extends Character {
    constructor(row, pos_x, pos_y, health, moveSpeed, flying) {
        super(row, pos_x, pos_y);
        this.health = health;
        this.moveSpeed = moveSpeed;
        this.flying = flying; // can this enemy type fly over walls?
    }

    //returns boolean value whether enemy can move into that direction on its currents position
    isValidMove(board, direction) {
        //console.log("isValidMove:");
        //console.log(board === undefined);
        switch(direction) {
            case "up":
                return board[this.position.row - 1][this.position.col].passable;
            case "down":  
                return board[this.position.row + 1][this.position.col].passable;
            case "right": 
                return board[this.position.row][this.position.col + 1].passable;
            case "left": 
                return board[this.position.row][this.position.col - 1].passable;
        }
    }

    //returns the number of valid directions this enemy can move to
    numValidDirections(board) {
        var count = 0;
        
        //console.log("numValidDirections");
        //console.log(board === undefined);
        if(this.isValidMove(board, "up")) count++;
        if(this.isValidMove(board, "down")) count++;
        if(this.isValidMove(board, "right")) count++;
        if(this.isValidMove(board, "left")) count++;
        return count;
    }

    // helper function. Converts a number into a direction ("up", "right" etc.)
    intToDir(number) {
        /*if(number !== parseInt(number, 10)) {
            alert("Error: Passed wrong parameter type");
            return;
        }*/
        switch(number % 4) {
            case 0: return "up";
            case 1: return "right";
            case 2: return "down";
            case 3: return "left";
        }
    }

    // wählt eine zufällig valide gültige Bewegungsrichtung aus.
    // Wenn keine existiert, wird idle auf true gesetzt.
    chooseMovingDirection(board) {
        let numDirections = this.numValidDirections(board);
        if(numDirections == 0) { // existiert keine valide Richtung -> idle = true
            this.idle = true;
        } else { // sonst wähle eine der validen Richtungen aus
            let randDir = Math.floor((Math.random(4) * 4) % 4);
            while(!this.isValidMove(board, this.intToDir(randDir))) {
                randDir = Math.floor((Math.random(4) * 4) % 4);
            }
            this.move(this.intToDir(randDir));
        }
    }
}

// basic enemy. 1 life, rather slow, can not fly.
class Creep extends Enemy{
    constructor(pos_x, pos_y) {
        super(1 * 16, pos_x, pos_y, 1, 5, false);
    }
    
}

function enemies(numEnemies) {
    // allEnemies is an array, which at each index saves the enemy object
    // as well as that enemy's current position on the gameboard
    var allEnemies = [];
    for(var i = 0; i < numEnemies; i++) {
        allEnemies.push(new Creep(i  + 1, i + 1));
    }
    return allEnemies;
}

// for debugging
function printAllEnemiesStats(enemies) {
    console.log("---------------------------");
    console.log("Enemies:");
    for(var i = 0; i < enemies.length; i++) {
        console.log(`   Enemy ${i}`);
        console.log(`       Health: ${this.health}`);
        console.log(`       Speed: ${this.moveSpeed}`);
        console.log(`       Flying: ${this.flying}`);
    }
    console.log("---------------------------");
}