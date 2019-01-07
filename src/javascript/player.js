class Player extends Character { //ToDo: block invalid movements
    constructor(y, row, col, health, maxBombs) {
        super(1.5, y * 16, row, col);
        this.health = health;
        this.maxBombs = maxBombs;
        this.holdsBomb = false;
        this.activeBombs = 0;
        this.lastKeyInput = KEY.NONE;
        this.canMove = true; // used for checking passable walls
    }

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
                this.idle = true;
                this.frame_cnt = -1;
                break;
        }
    }

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
        if (this.canMove) {
            super.refreshPos();
        }
    }

    refreshPixelPos(pix_offset) {
        if (this.canMove) {
            super.refreshPixelPos(pix_offset);
        }
    }

    plantBomb() {
        if (this.activeBombs < this.maxBombs) {
            items.push(new Bomb(this.position.row, this.position.col, 3, 4, this));
            this.activeBombs++;
            this.holdsBomb = false;
        }
    }
}

class Explosion {
    constructor(row, col, vertical, animation_pos) {
        this.row = row;
        this.col = col;
        this.pos_x = col * tileSize;
        this.pos_y = row * tileSize;

        this.vertical = vertical;
        if (vertical) {
            this.animation = new AnimationFrame(14 * 16, animation_pos * 16, tileSize, tileSize)
        } else {
            this.animation = new AnimationFrame(animation_pos * 16, 5 * 16, tileSize, tileSize)
        }
    }

    getAnimation() {
        return this.animation;
    }
}

class Bomb {
    constructor(row, col, range, timer, plantedBy) {
        this.row = row;
        this.col = col;
        this.pos_x = col * tileSize;
        this.pos_y = row * tileSize;

        this.range = range;

        this.player = plantedBy;

        this.explosionId = explosions.length + 1; // used to insert explosion array in gloabl explions

        this.animation = [];
        for (let i = 4; i < 10; i++) {
            this.animation.push(new AnimationFrame(i * 16, 5 * 16, 16, 16))
        }

        for (let i = 0; i < 3; i++) {
            this.animation.push(new AnimationFrame(2 * 16, 5 * 16, 16, 16));
        }


        for (let i = 5; i >= 3; i--) {
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

        this.animation_fuse = setInterval(
            (function (self) {         //wrapping necessary to preserve "this"-context
                return function () {   //otherwise, interval function would become global, where "this" does not exist
                    self.setAnimationSize();
                }
            })(this),
            timer * 3
        );  //Zündschnur for animation effekt of bomb

        this.animaton_size = 1;
        this.tick = -1;
    }

    setAnimationSize() {
        this.tick++;
        if (this.tick % 100 < 50) {
            this.animaton_size = 0.7 + 0.006 * (this.tick % 50);
        } else {
            this.animaton_size = 1.0 - 0.006 * (this.tick % 50);
        }
    }
    updateBombState() {
        this.state++;
        if (this.state === 6) {
            this.animaton_size = 1.1;
            clearInterval(this.animation_fuse);
            this.explode();
            this.calcDamage(explosions);
        } else if (this.state > 6 && this.state < 9) {
            this.calcDamage();
        } else if (this.state === 9) {
            this.animaton_size = 0.9;
            delete explosions[this.explosionId];
        } else if (this.state > 11) {
            clearInterval(this.fuse);
            items = items.filter(item => item != this); //remove bomb from items
            this.player.activeBombs--; //bomb is no longer active, so reduce # of active bombs in player
            return;
        }
    }
    explode() {
        let explosion = [];
        //up
        for (let i = 1; i <= this.range; i++) {
            if (board.data[this.row - i][this.col] === tileTypes.wall) break;
            else {
                explosion.push(new Explosion(this.row - i, this.col, true, 1));
                if(board.data[this.row - i][this.col].breakable) break;
            }
        }
        //down
        for (let i = 1; i <= this.range; i++) {
            if (board.data[this.row + i][this.col] === tileTypes.wall) break;
            else {
                explosion.push(new Explosion(this.row + i, this.col, true, 1));
                if(board.data[this.row + i][this.col].breakable) break;
            }
        }

        //left
        for (let i = 1; i <= this.range; i++) {
            if (board.data[this.row][this.col - i] === tileTypes.wall) break;
            else {
                explosion.push(new Explosion(this.row, this.col - i, false, 1));
                if (board.data[this.row][this.col - i].breakable) break;
            }
        }

        //right
        for (let i = 1; i <= this.range; i++) {
            if (board.data[this.row][this.col + i] === tileTypes.wall) break;
            else {
                explosion.push(new Explosion(this.row, this.col + i, false, 1));
                if (board.data[this.row][this.col + i].breakable) break;
            }
        }

        explosions[this.explosionId] = explosion; //push to global array.

    }

    calcDamage(){
        let explosion = explosions[this.explosionId];
        explosion.forEach(exp_part => { //array containing one explosion (wich cover multible tiles)
            enemies.forEach(enemy =>{
                if(enemy.position.row === exp_part.row && enemy.position.col === exp_part.col){
                    enemy.idle = true;
                    setTimeout(function(){enemy.position.row = -12;},2000);
                }
            })
            if(board.data[exp_part.row][exp_part.col] !== undefined && board.data[exp_part.row][exp_part.col].breakable){
                setTimeout(function(){board.data[exp_part.row][exp_part.col] = tileTypes.empty;}, 2000);
            }
        });
    }

    getAnimation() {
        this.animation[this.state].dim_x = tileSize * this.animaton_size;
        this.animation[this.state].dim_y = tileSize * this.animaton_size;
        return this.animation[this.state];
    }

}