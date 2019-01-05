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
            24
        );  //Zündschnur for animation effekt of bomb

        this.animaton_size = 1;
        this.tick = -1;
    }

    setAnimationSize() {
        this.tick++;
        if (this.tick % 100 < 50) {
            this.animaton_size = 0.6 + 0.006 * (this.tick % 50);
        } else {
            this.animaton_size = 0.9 - 0.006 * (this.tick % 50);
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
class Player extends Character { //ToDo: add bombs, add life etc.
    constructor(y, row, col) {
        super(1, y, row, col);
    }
}