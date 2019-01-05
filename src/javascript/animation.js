let ticks = []; //in this array the animation ticks for each character are stored
let frame_cnts = [];

class AnimationFrame {
    constructor(x, y, dim_x, dim_y) { //dim: how big is character on assets.png
        this.x = x;
        this.y = y;
        this.dim_x = dim_x;
        this.dim_y = dim_y;
    }
}

/*stores information about position on gameBoard-Matrix, Position on canvas and the animations*/
class Character {
    //speed: 1 = 100% (one row every 60 frames), 0.6 = 60 %, 1.2 = 120 % and so on
    constructor(speed, y, row, col, dim_x = 16, dim_y = 16) { //which y position on asset png is player/monster
        this.idle = false; //is caracter currently moving?

        this.speed = Math.round(6.66666666667 * GAME_SPEED / speed); 

        this.position = {
            row: row, //row on matrix (number of rows equals number of vertical tiles)
            col: col,
            pix_x: col * tileSize, //current position in pixel on canvas. later, this is used to calc the offset
            pix_y: row * tileSize
        }

        this.direction = new Array(4); //up, down, right

        //up
        this.direction[0] = new Array(3);
        this.direction[0][0] = new AnimationFrame(0, y + 1, dim_x, dim_y); //idle
        this.direction[0][1] = new AnimationFrame(8 * dim_x, y + 1, dim_x, dim_y); //animation up #1
        this.direction[0][2] = new AnimationFrame(9 * dim_x, y + 1, dim_x, dim_y); //animation up #

        //down
        this.direction[1] = new Array(3);
        this.direction[1][0] = new AnimationFrame(1 * dim_x, y, dim_x, dim_y); //idle
        this.direction[1][1] = new AnimationFrame(2 * dim_x, y, dim_x, dim_y); //animation down #1
        this.direction[1][2] = new AnimationFrame(3 * dim_x, y, dim_x, dim_y); //animation down #2

        //right
        this.direction[2] = new Array(4);
        this.direction[2][0] = new AnimationFrame(4 * dim_x, y + 1, dim_x, dim_y); //idle
        this.direction[2][1] = new AnimationFrame(5 * dim_x, y + 1, dim_x, dim_y); //animation right #1
        this.direction[2][2] = new AnimationFrame(6 * dim_x, y + 1, dim_x, dim_y); //animation right #2
        this.direction[2][3] = new AnimationFrame(7 * dim_x, y + 1, dim_x, dim_y); //animation right #3

        //left
        this.direction[3] = new Array(4);
        this.direction[3][0] = new AnimationFrame(10 * dim_x, y + 1, dim_x, dim_y); //idle
        this.direction[3][1] = new AnimationFrame(11 * dim_x, y + 1, dim_x, dim_y); //animation left #1
        this.direction[3][2] = new AnimationFrame(12 * dim_x, y + 1, dim_x, dim_y); //animation left #2
        this.direction[3][3] = new AnimationFrame(13 * dim_x, y + 1, dim_x, dim_y); //animation left #3

        this.last_direction = "up"; //up per default
        this.tick = ticks.length; //whick position in the array is the tick beloning to this character
        ticks.push(0); //create new tick variable and add it to the array (used for e.g. calculation of current animation Frame)
        this.frame_cnt = frame_cnts.length;
        frame_cnts.push(-1);
        console.log("construktor speed: " + this.speed + " row : " + this.position.row + " col: " + this.position.col + " pos_x " + this.position.pix_x + " pos_y " + this.position.pix_y);
    }

    updateFrameCnt() {
        frame_cnts[this.frame_cnt] = (frame_cnts[this.frame_cnt] + 1) % this.speed;
    }

    /*this function is called once every nth frame, where n = MOVEMENT_SPEED*/
    refreshPos() {
        if (!this.idle) {
            switch (this.last_direction) {
                case "down": //based on  direction, the characters position in the matrix is updated
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

    /*This Function calculates the offset on the canvas to simulate a smooth motion.*/
    refreshPixelPos(pix_offset) {
        if (!this.idle) {
            switch (this.last_direction) {
                case "down":
                    this.position.pix_y = (this.position.row * tileSize) - pix_offset;
                    return;
                case "up":
                    this.position.pix_y = (this.position.row * tileSize) + pix_offset;
                    return;
                case "left":
                    this.position.pix_x = (this.position.col * tileSize) + pix_offset;
                    return;
                case "right":
                    this.position.pix_x = (this.position.col * tileSize) - pix_offset;
                    return;
            }
        }
    }

    getAnimation() {
        if (this.idle) {
            return this.getIdle(); //if idle, get idle Animation-Frame
        } else {
            return this.move(this.last_direction);
        }
    }

    getFrameCount() {
        return frame_cnts[this.frame_cnt];
    }

    move(movement) {
        if (frame_cnts[this.frame_cnt] % 10 === 0) { //every 10th frame, a new animation image is shown
            ticks[this.tick] += 1; //counts next animation
        }
        if (movement !== this.last_direction) { //direction changed
            ticks[this.tick] = 1; // 0 would be idle, 1 is first moving motion
        } else if (ticks[this.tick] === 12) {
            ticks[this.tick] = 0;
        }
        this.last_direction = movement; //save the direction, the character is heading

        switch (movement) {
            case "up":
                return this.direction[0][ticks[this.tick] % 3];
            case "down":
                return this.direction[1][ticks[this.tick] % 3];
            case "right":
                return this.direction[2][ticks[this.tick] % 4];
            case "left":
                return this.direction[3][ticks[this.tick] % 4];
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
                return this.direction[2][0];
            case "left":
                return this.direction[3][0];
            default:
                return this.direction[0][0];
        }
    }

}

