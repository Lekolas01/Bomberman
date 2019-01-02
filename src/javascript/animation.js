let ticks = [];

class AnimationFrame {
    constructor(x, y, dim_x, dim_y) { //dim: how big is character on assets.png
        this.x = x;
        this.y = y;
        this.dim_x = dim_x;
        this.dim_y = dim_y;
    }
}

class Character {
    constructor(y, prow, pcol, dim_x = 16, dim_y = 16) { //which y position on asset png is player/monster
        this.idle = false;

        this.position = {
            row: prow,
            col: pcol,
            pix_x: prow * tileSize,
            pix_y: pcol * tileSize
        }

        this.direction = new Array(3); //up, down, right

        //up
        this.direction[0] = new Array(3);
        this.direction[0][0] = new AnimationFrame(0, y, dim_x, dim_y); //idle
        this.direction[0][1] = new AnimationFrame(8 * dim_x, y, dim_x, dim_y); //animation up #1
        this.direction[0][2] = new AnimationFrame(9 * dim_x, y, dim_x, dim_y); //animation up #

        //down
        this.direction[1] = new Array(3);
        this.direction[1][0] = new AnimationFrame(1 * dim_x, y, dim_x, dim_y); //idle
        this.direction[1][1] = new AnimationFrame(2 * dim_x, y, dim_x, dim_y); //animation down #1
        this.direction[1][2] = new AnimationFrame(3 * dim_x, y, dim_x, dim_y); //animation down #2

        //right
        this.direction[2] = new Array(4);
        this.direction[2][0] = new AnimationFrame(4 * dim_x, y, dim_x, dim_y); //idle
        this.direction[2][1] = new AnimationFrame(5 * dim_x, y, dim_x, dim_y); //animation right #1
        this.direction[2][2] = new AnimationFrame(6 * dim_x, y, dim_x, dim_y); //animation right #2
        this.direction[2][3] = new AnimationFrame(7 * dim_x, y, dim_x, dim_y); //animation right #3

        this.last_direction = "down"; //up per default
        this.tick = ticks.length;
        ticks.push(0);
    }

    refreshPos() {
        if (!this.idle) {
                switch (this.last_direction) {
                    case "down":
                        this.position.row += 1;
                        break;
                    case "up":
                        this.position.row -= 1;
                        break;
                    case "right":
                        this.position.col += 1;
                        break;
                    case "left":
                        this.position.col -= 1;
                        break;
            }
        }
    }

    refreshPixelPos() {
        let tmp = tileSize - ((tileSize / MOVEMENT_SPEED) * ((frame_cnt % MOVEMENT_SPEED) + 1));
        switch (this.last_direction) {
            case "down":
                this.position.pix_y = (this.position.row * tileSize) - tmp;
                return;
            case "up":
                this.position.pix_y = (this.position.row * tileSize) + tmp;
                return;
            case "right":
                this.position.pix_x = (this.position.col * tileSize) + tmp;
                return;
            case "left":
                this.position.pix_x = (this.position.col * tileSize) - tmp;
                return;
        }
    }

    getAnimation() {
        if (this.idle) {
            return this.getIdle();
        } else {
            return this.move(this.last_direction);
        }
    }

    move(movement) {
        if (frame_cnt % 10 === 0) { //every 10th frame, a new animation image is shown
            ticks[this.tick] += 1; //counts next animation
        }
        if (movement !== this.last_direction) { //direction changed
            ticks[this.tick] = 1; // 0 would be idle, 1 is first moving motion
        } else if (ticks[this.tick] === 12) {
            ticks[this.tick] = 0;
        }
        this.last_direction = movement;

        switch (movement) {
            case "up":
                return this.direction[0][ticks[this.tick] % 3];
            case "down":
                return this.direction[1][ticks[this.tick] % 3];
            case "right":
            case "left":
                return this.direction[2][ticks[this.tick] % 4];
            default:
                return this.direction[0][0];
        }
    }
    getIdle() {
        switch (this.last_direction) {
            case "up":
                return this.direction[0][0];
            case "down":
                return this.direction[1][0];
            case "right":
            case "left":
                return this.direction[2][0];
            default:
                return this.direction[0][0];
        }
    }

}

class Bomb {
    constructor() {

    }

}
class Player extends Character {
    constructor(y, row, col) {
        super(y, row, col);
    }
}

