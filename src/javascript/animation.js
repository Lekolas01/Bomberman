var ticks = {
    player1_tick : 0,
    player2_tick : 0,
    monster_tick : 0
}
var frame_cnt = 0;

class AnimationFrame {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Character {
    constructor(row, tick, pos_x, pos_y) { //which row on asset png is player/monster
        this.idle = true;
        
        this.position = {
            x: pos_x,
            y: pos_y
        }

        this.direction = new Array(3); //up, down, right
        let y = 16 * row;

        //up
        this.direction[0] = new Array(3);
        this.direction[0][0] = new AnimationFrame(0, y); //idle
        this.direction[0][1] = new AnimationFrame(8 * 16, y); //animation up #1
        this.direction[0][2] = new AnimationFrame(9 * 16, y); //animation up #

        //down
        this.direction[1] = new Array(3);
        this.direction[1][0] = new AnimationFrame(1 * 16, y); //idle
        this.direction[1][1] = new AnimationFrame(2 * 16, y); //animation down #1
        this.direction[1][2] = new AnimationFrame(3 * 16, y); //animation down #2

        //right
        this.direction[2] = new Array(4);
        this.direction[2][0] = new AnimationFrame(4 * 16, y); //idle
        this.direction[2][1] = new AnimationFrame(5 * 16, y); //animation right #1
        this.direction[2][2] = new AnimationFrame(6 * 16, y); //animation right #2
        this.direction[2][3] = new AnimationFrame(7 * 16, y); //animation right #3

        this.last_direction = "up"; //up per default
        this.tick = tick;
        ticks[this.tick] = 0;
    }

    getAnimation(){
        if(this.idle){
            return this.getIdle();
        }else{
            return this.move(this.last_direction);
        }
    }

    move(movement) {
        if(frame_cnt % 15 === 0){ //every 10th frame, a new animation image is shown
            ticks[this.tick] += 1; //counts next animation
        }
        if (movement !== this.last_direction) { //direction changed
            ticks[this.tick] = 1; // 0 would be idle, 1 is first moving motion
        }else if(ticks[this.tick] === 12){
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
    getIdle(){
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

class Bomb{
    constructor(){
        
    }

}
class Player extends Character{
    constructor(row, tick, pos_x, pos_y){
        super(row, tick, pos_x, pos_y);
    }
}

