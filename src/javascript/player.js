class Player extends Character { //ToDo: block invalid movements
    constructor(y, row, col, health) {
        super(1.5, y * 16, row, col);
        this.health = health;
        this.maxBombs = 3;
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
        if (this.lastKeyInput != KEY.NONE);
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
            board.items.push(new Bomb(this.position.row, this.position.col, 2, 4, this));
            this.activeBombs++;
        }
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

class Bomb {
    constructor(row, col, range, timer, plantedBy) {
        this.position = {
            row: row,
            col: col,
            pix_x: col * tileSize,
            pix_y: row * tileSize
        };

        this.range = range;

        this.player = plantedBy;

        this.explosionId = board.explosions.length + 1; // used to insert explosion array in gloabl explions

        this.animation = [];
        for (let i = 4; i < 10; i++) {
            this.animation.push(new AnimationFrame(i * 16, 6 * 16, 16, 16))
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

        this.animaton_size_factor = 1;
        this.tick = -1;
    }

    setAnimationSize() {
        this.tick++;
        if (this.tick % 200 < 100) { //bomb animation effekt (grows bigger and smaller)
            this.animation_size_factor = 0.7 + 0.003 * (this.tick % 100);
        } else {
            this.animation_size_factor = 1.0 - 0.003 * (this.tick % 100);
        }
    }
    updateBombState() {
        this.state++;
        if (this.state === 6) {
            clearInterval(this.animation_fuse);
            this.explode();
            this.calcDamage(board.explosions);
        } else if (this.state > 6 && this.state < 9) {
            this.calcDamage();
        } else if (this.state === 9) {
            this.animation_size_factor = 0.9;
            delete board.explosions[this.explosionId];
        } else if (this.state > 11) {
            clearInterval(this.fuse);
            board.items = board.items.filter(item => item != this); //remove bomb from items
            this.player.activeBombs--; //bomb is no longer active, so reduce # of active bombs in player
            return;
        }
    }
    explode() {
        let explosion = [];
        let row = this.position.row;
        let col = this.position.col;
        //up
        for (let i = 1; i <= this.range; i++) {
            if (board.data[row - i][col] === tileTypes.wall) break;
            else {
                if (i === this.range) explosion.push(new Explosion(row - i, col, true, 0));
                else explosion.push(new Explosion(row - i, col, true, 1));

                if (board.data[row - i][col].breakable) break;
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

        board.explosions[this.explosionId] = explosion; //push to global array.

    }

    calcDamage() {
        let explosion = board.explosions[this.explosionId];
        explosion.forEach(exp_part => { //array containing one explosion (wich cover multible tiles)
            board.enemies.forEach(enemy => {
                if (enemy.position.row === exp_part.position.row && enemy.position.col === exp_part.position.col) {
                    enemy.idle = true;
                    setTimeout(function () { enemy.position.row = -12; }, 2000);
                }
            })
            if (board.data[exp_part.position.row][exp_part.position.col] !== undefined && board.data[exp_part.position.row][exp_part.position.col].breakable) {
                setTimeout(function () { board.data[exp_part.position.row][exp_part.position.col] = tileTypes.empty; }, 2000);
            }
        });
    }

    getAnimation() {
        if (this.state <= 5) this.setAnimationSize();
        else if (this.state === 6) this.animation_size_factor = 1.1;
        this.animation[this.state].animation_size = tileSize * this.animation_size_factor;
        return this.animation[this.state];
    }

}