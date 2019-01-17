const playerMaxStats = {
    bombStrength: 10,
    maxBombs: 10,
    moveSpeed: 6
}


class Player extends Character {
    constructor(rowOnAsset, row, col, health) {
        super(2, rowOnAsset * 16, row, col, 100); //100 points another player kills this
        this.health = health;
        this.maxBombs = 2;
        this.bombStrength = 2;
        this.activeBombs = 0;
        this.runningSpeed = 5; // not yet used
        this.lastKeyInput = KEY.NONE;
        this.canMove = true; // used for checking passable walls
        this.score = 0;
    }

    updateKey(input) {
        this.lastKeyInput = input;
        var l_dir = this.last_direction;
        if (!this.idle && !this.canMove) {
            this.updateDirection();
            if (l_dir !== this.last_direction) this.frame_cnt = -1;
        }
    }

    //based on user input, the last pressed key is updated. 
    //(which will be used for determining the next tile, the character is moving towards)
    updateDirection() {
        this.idle = false;
        switch (this.lastKeyInput) {
            case KEY.UP:
                this.last_direction = DIRECTION.UP;
                break;
            case KEY.DOWN:
                this.last_direction = DIRECTION.DOWN;
                break;
            case KEY.RIGHT:
                this.last_direction = DIRECTION.RIGHT;
                break;
            case KEY.LEFT:
                this.last_direction = DIRECTION.LEFT;
                break;
            case KEY.NONE:
                this.idle = true; //if no key responsible for directins was pressed, player is set to "idle"
                this.frame_cnt = -1;
                break;
        }
    }

    //checks if position, where player would be moving to, is passable at sets this property
    tryMove(board) {
        let row = this.position.row;
        let col = this.position.col;

        switch (this.last_direction) {
            case DIRECTION.UP: row -= 1; break;
            case DIRECTION.DOWN: row += 1; break;
            case DIRECTION.RIGHT: col += 1; break;
            case DIRECTION.LEFT: col -= 1; break;
        }

        this.canMove = board.data[row][col].passable;
    }

    refreshPos() {
        if (this.canMove) {  //leads to "pokemon"-style animation, when trying to move somewhere unpassable.
            super.refreshPos();
        }
    }

    refreshPixelPos(pix_offset) {
        if (this.canMove) { //leads to "pokemon"-style animation, when trying to move somewhere unpassable.
            super.refreshPixelPos(pix_offset);
        }
    }

    //if not already happend, die() removes player from player array, then calls super function
    die() {
        let playerIndex = board.players.indexOf(this);
        if (playerIndex >= 0) {
            delete board.players[playerIndex];
            if (playerIndex > 0) gamepads[playerIndex - 1].disconnect();
            super.die();
            alert("Final Score for player " + (playerIndex + 1) + " is: " + this.score);
        }
    }

    plantBomb() {
        if (this.activeBombs < this.maxBombs) {
            let activeBombAtPos = false;

            board.bombs.forEach(bomb => {
                if (!activeBombAtPos) {//when no active bomb has been found at this position yet
                    activeBombAtPos = typeof Bomb && (bomb.position.row === this.position.row && bomb.position.col === this.position.col);
                }
            });

            if (!activeBombAtPos) { //only when no active bomb is at the position a new one can be planted
                board.bombs.push(new Bomb(this.position.row, this.position.col, this.bombStrength, 4, this)); //drop bomb at current position
                this.activeBombs++;
            }
        }
    }

    updateScore(points){
        this.score += points;
    }
}

class Explosion {
    constructor(row, col, vertical, animation_pos) {
        this.position = {
            row: row,
            col: col,
            pix_x: col * tileSize,
            pix_y: row * tileSize
        };

        this.vertical = vertical;
        if (vertical) {
            this.animation = new AnimationFrame(14 * 16, animation_pos * 16, 16, 16, tileSize)
        } else {
            this.animation = new AnimationFrame(animation_pos * 16, 5 * 16, 16, 16, tileSize)
        }
    }

    getAnimation() {
        return this.animation;
    }
}

let explosionIdCnt = -1;
class Bomb {
    constructor(row, col, range, timer, plantedBy) {
        this.position = {
            row: row,
            col: col,
            pix_x: col * tileSize,
            pix_y: row * tileSize
        };

        this.range = range;

        this.plantedBy = plantedBy;

        explosionIdCnt = (explosionIdCnt + 1) % 30;
        this.explosionId = explosionIdCnt// used to insert explosion array in gloabl explosions

        this.animation = [];
        for (let i = 4; i < 10; i++) {
            this.animation.push(new AnimationFrame(i * 16, 5 * 16, 16, 16))
        }

        for (let i = 0; i < 3; i++) { //big booom
            this.animation.push(new AnimationFrame(2 * 16, 5 * 16, 16, 16));
        }


        for (let i = 5; i >= 3; i--) { //fading out of the explosion
            this.animation.push(new AnimationFrame(14 * 16, i * 16, 16, 16));
        }
        this.state = 0;
        this.fuse = setInterval(
            (function (self) {         //wrapping necessary to preserve "this"-context
                return function () {   //otherwise, interval function would become global, where "this" does not exist
                    self.updateBombState();
                }
            })(this),
            timer * 100
        );  //Zündschnur

        this.animaton_size_factor = 1;
        this.tick = -1;
    }

    setAnimationSize() {
        this.tick++;
        if (this.tick % 200 < 100) { //bomb animation effekt (grows bigger and smaller)
            this.animation_size_factor = 0.6 + 0.003 * (this.tick % 100);
        } else {
            this.animation_size_factor = 0.9 - 0.003 * (this.tick % 100);
        }
    }

    updateBombState() {
        this.state++;
        if (this.state === 6) { //bomb will now explode
            clearInterval(this.animation_fuse);
            this.explode();
            this.calcDamage(board.explosions);
        } else if (this.state > 6 && this.state < 9) { //explosion is happening
            //this.calcDamage(); // es sollte nur der erste frame schaden machen, finde ich (tell me what you think)
        } else if (this.state === 9) { // Explosion fades out
            this.animation_size_factor = 0.9;
            delete board.explosions[this.explosionId];
        } else if (this.state > 11) { //Explosion fadet out completely
            clearInterval(this.fuse);
            board.bombs = board.bombs.filter(bomb => bomb != this); //remove bomb from board.bombs
            return;
        }
    }
    explode() {
        let explosion = [];
        let row = this.position.row;
        let col = this.position.col;

        this.plantedBy.activeBombs--; //bomb is no longer active, so reduce # of active bombs in player
        audioBombExplode.play();
        //up
        for (let i = 1; i <= this.range; i++) {
            if (board.data[row - i][col] === tileTypes.wall) break; //if its a wall, explosion cannot expand further
            else {
                if (i === this.range) explosion.push(new Explosion(row - i, col, true, 0)); //if we are at the outmost bit of the explosion, add ending explosion image
                else explosion.push(new Explosion(row - i, col, true, 1)); //else, the normal one

                if (board.data[row - i][col].breakable) break; //hehe, break (because breakable right :D).
                //in this case, one explosion part for the breakable tile has been added
                //but after that, the explosion is stopped.
            }
        }
        //down
        for (let i = 1; i <= this.range; i++) {
            if (board.data[row + i][col] === tileTypes.wall) break;
            else {
                if (i === this.range) explosion.push(new Explosion(row + i, col, true, 2));
                else explosion.push(new Explosion(row + i, col, true, 1));

                if (board.data[row + i][col].breakable) break;
            }
        }

        //left
        for (let i = 1; i <= this.range; i++) {
            if (board.data[row][col - i] === tileTypes.wall) break;
            else {
                if (i === this.range) explosion.push(new Explosion(row, col - i, false, 0));
                else explosion.push(new Explosion(row, col - i, false, 1));

                if (board.data[row][col - i].breakable) break;
            }
        }

        //right
        for (let i = 1; i <= this.range; i++) {
            if (board.data[row][col + i] === tileTypes.wall) break;
            else {
                if (i === this.range) explosion.push(new Explosion(row, col + i, false, 3)); //last animation is different
                else explosion.push(new Explosion(row, col + i, false, 1));

                if (board.data[row][col + i].breakable) break;
            }
        }

        //one dummy explosion for the center (needed for calc damage)
        let center = new Explosion(row, col, false, 0);
        center.animation.animation_size = 0; //no need to draw it, just necessary for calcDamage
        explosion.push(center);

        board.explosions[this.explosionId] = explosion; //push explosion to global explosions array. (multible explosions can happen at the same time)
        //audioBombExplode.play();
    }

    calcDamage() {
        let explosion = board.explosions[this.explosionId]; //get the explosion-array beloning to this bomb
        explosion.forEach(exp_part => { //array containing one explosion (wich cover multible tiles)
            board.enemies.forEach(enemy => {
                if (enemy.position.row === exp_part.position.row && enemy.position.col === exp_part.position.col) {
                    enemy.die();
                    this.plantedBy.updateScore(enemy.pointsWhenKilled);
                }
            })

            if (board.data[exp_part.position.row][exp_part.position.col] !== undefined && board.data[exp_part.position.row][exp_part.position.col].breakable) {
                {
                    board.data[exp_part.position.row][exp_part.position.col] = tileTypes.empty;
                    this.plantedBy.updateScore(5); //5 point for destroying walls

                    if (Math.random() <= board.itemSpawnChance) {
                        board.addRandomItem(exp_part.position.row, exp_part.position.col);
                    }
                }

            }

            board.players.forEach(player => {
                if (player.position.row === exp_part.position.row && player.position.col === exp_part.position.col) {
                    player.die();
                    //audioDeath.play();
                    if (player != this.plantedBy) this.updateScore(player.pointsWhenKilled);
                }
            });

            //calc, if this explosion causes another bomb to explode sooner
            let otherPies = board.bombs.filter(pie => pie != this); //these pies aren't homemade, they were made in a factory...a bomb factory...they're bombs
            for (let i = 0; i < otherPies.length; i++) {
                if (otherPies[i].position.row === exp_part.position.row &&
                    otherPies[i].position.col === exp_part.position.col) {
                    otherPies[i].earlyfuze();
                }
            }
        });
    }

    //when bomb is near another explosion, bomb will go off sooner
    earlyfuze() {
        if (this.state < 6) {
            this.state = 6;
            clearInterval(this.animation_fuse);
            this.explode();
            this.calcDamage(board.explosions);
        }
    }

    getAnimation() {
        if (this.state <= 5) this.setAnimationSize();
        else if (this.state === 6) this.animation_size_factor = 1.1;
        this.animation[this.state].animation_size = tileSize * this.animation_size_factor;
        return this.animation[this.state];
    }
    
}