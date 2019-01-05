class Player extends Character { //ToDo: resolve input lag
    constructor(y, row, col, health, bombs) {
        super(2, y * 16, row, col);
        this.health = health;
        this.bombs = bombs;
        this.activeBombs = 0;
        this.lastKeyInput = KEY.NONE;
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
            default:
                this.idle = true;

        }
    }
}

class Bomb {
    constructor(row, col, timer) {
        this.row = row;
        this.col = col;
        this.pos_x = col * tileSize;
        this.pos_y = row * tileSize;

        this.exploded = false;

        this.animation = [];
        for (let i = 4; i < 10; i++) {
            this.animation.push(new AnimationFrame(i * 16, 5 * 16, 16, 16))
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
        if (this.state == 5) {
            this.explode();
            //setTimeout(null, 2000);
        } else if (this.state > 7) {
            clearInterval(this.fuse);
            clearInterval(this.animation_fuse);
            delete this;
            return;
        }
    }
    explode() {
    }

    getAnimation() {
        this.animation[this.state].dim_x = tileSize * this.animaton_size;
        this.animation[this.state].dim_y = tileSize * this.animaton_size;
        return this.animation[this.state];
    }

}