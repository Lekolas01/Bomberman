class Enemy {
    constructor(health, moveSpeed, flying, x, y) {
        this.health = health;
        this.moveSpeed = moveSpeed;
        this.flying = flying; // can this enemy type fly over walls?
        this.x = x;
        this.y = y;
    }
}

// basic enemy. 1 life, rather slow, can not fly.
class Creep extends Enemy{
    constructor() {
        super(1, 5, false, 80, 0);
    }
}

function enemies(numEnemies) {
    // allEnemies is an array, which at each index saves the enemy object
    // as well as that enemy's current position on the gameboard
    var allEnemies = [];
    for(var i = 0; i < numEnemies; i++) {
        allEnemies.push({
            enemy: new Creep,
            x:     i,
            y:     i 
        });
    }
    return allEnemies;
}

function drawEnemies(enemies, ctx) {
    //console.log("drawEnemies();");
    //console.log(`numEnemies = ${enemies.length};`);
    for (var i = 0; i < enemies.length; i++) {
        ctx.drawImage(document.getElementById('art_assets'),
                    enemies[i].enemy.x, enemies[i].enemy.y, 16, 16,
                    enemies[i].x * tileSize, enemies[i].y * tileSize, tileSize, tileSize);
    }

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