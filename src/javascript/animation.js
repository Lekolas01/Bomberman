class AnimationFrame {
	constructor(x, y, dim_x, dim_y, animation_size = tileSize) {
		//dim: how big is character on assets.png
		this.x = x;
		this.y = y;
		this.dim_x = dim_x;
        this.dim_y = dim_y;
        this.animation_size = animation_size;
	}
}

/*stores information about position on gameBoard-Matrix, Position on canvas and the animations*/
class Character {
	//speed: 1 = 100% (one row every 60 frames), 0.6 = 60 %, 1.2 = 120 % and so on
	constructor(speed, y, row, col, dim_x = 16, dim_y = 16) {
		//which y position on asset png is player/monster
		this.idle = false; //is caracter currently moving?

		this.speed = Math.round((6.66666666667 * GAME_SPEED) / speed);

		this.position = {
			row: row, //row on matrix (number of rows equals number of vertical tiles)
			col: col,
			pix_x: col * tileSize, //current position in pixel on canvas. later, this is used to calc the offset
			pix_y: row * tileSize,
		};

		this.direction = new Array(4); //up, down, right

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

		//left
		this.direction[3] = new Array(4);
		this.direction[3][0] = new AnimationFrame(10 * dim_x, y, dim_x, dim_y); //idle
		this.direction[3][1] = new AnimationFrame(11 * dim_x, y, dim_x, dim_y); //animation left #1
		this.direction[3][2] = new AnimationFrame(12 * dim_x, y, dim_x, dim_y); //animation left #2
		this.direction[3][3] = new AnimationFrame(13 * dim_x, y, dim_x, dim_y); //animation left #3
        
		this.last_direction = DIRECTION.UP; //up per default
		this.tick = 0; //used for calculating wich animation is displayed
        this.frame_cnt = -1; //used for calculation of pixel offset when moving

	}

	updateFrameCnt() {
		this.frame_cnt = (this.frame_cnt + 1) % this.speed;
	}

	/*this function is called once every nth frame, where n = MOVEMENT_SPEED*/
	refreshPos() {
		if (!this.idle) {
			switch (this.last_direction) {
				case DIRECTION.DOWN: //based on  direction, the characters position in the matrix is updated
					this.position.row += 1;
					break;
				case DIRECTION.UP:
					this.position.row -= 1;
					break;
				case DIRECTION.RIGHT:
					this.position.col += 1;
					break;
				case DIRECTION.LEFT:
					this.position.col -= 1;
					break;
			}
		}
	}

	/*This Function calculates the offset on the canvas to simulate a smooth motion.*/
	refreshPixelPos(pix_offset) {
		if (!this.idle) {
			switch (this.last_direction) {
				case DIRECTION.DOWN:
					this.position.pix_y = this.position.row * tileSize - pix_offset;
					return;
				case DIRECTION.UP:
					this.position.pix_y = this.position.row * tileSize + pix_offset;
					return;
				case DIRECTION.LEFT:
					this.position.pix_x = this.position.col * tileSize + pix_offset;
					return;
				case DIRECTION.RIGHT:
					this.position.pix_x = this.position.col * tileSize - pix_offset;
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

	move(movement) {
		if (this.frame_cnt % 10 === 0) {
			//every 10th frame, a new animation image is shown
			this.tick += 1; //counts next animation
		}
		if (movement !== this.last_direction) {
			//direction changed
			this.tick = 1; // 0 would be idle, 1 is first moving motion
		} else if (this.tick === 12) {
			this.tick = 0;
		}
		this.last_direction = movement; //save the direction, the character is heading

		switch (movement) {
			case DIRECTION.UP:
				return this.direction[0][this.tick % 3];
			case DIRECTION.DOWN:
				return this.direction[1][this.tick % 3];
			case DIRECTION.RIGHT:
				return this.direction[2][this.tick % 4];
			case DIRECTION.LEFT:
				return this.direction[3][this.tick % 4];
			default:
				this.idle = true;
				return this.direction[0][0];
		}
	}
	getIdle() {
		switch (this.last_direction) {
			case DIRECTION.UP:
				return this.direction[0][0];
			case DIRECTION.DOWN:
				return this.direction[1][0];
			case DIRECTION.RIGHT:
				return this.direction[2][0];
			case DIRECTION.LEFT:
				return this.direction[3][0];
			default:
				return this.direction[0][0];
		}
	}

	// helper function. Converts a number into a direction ("up", "right" etc.)
	// 0 -> up, 1 -> right, 2 -> down, 3 -> left
	intToDir(number) {
		if (number !== parseInt(number, 10)) {
			alert('Error: Passed wrong parameter type');
			return;
		}
		switch (number % 4) {
			case 0:
				return DIRECTION.UP;
			case 1:
				return DIRECTION.RIGHT;
			case 2:
				return DIRECTION.DOWN;
			case 3:
				return DIRECTION.LEFT;
		}
    }
    

    //is called by base function.
    die(){
        board.morituri.push(this);
        this.dead = true;
        this.idle = true;

        this.tick = -1;
        this.bleed = setInterval(
            (function (self) {         //wrapping necessary to preserve "this"-context
                return function () {   
                    self.animateDying();
                }
            })(this),
            1500/GAME_SPEED); //~6 times per second
    }


    animateDying(){
        this.tick++;
        if(this.tick >= 16){
            this.bleed = null;
            board.morituri = board.morituri.filter(moribunda => moribunda != this);
            return;
        }

        if(this.tick % 4 < 2) this.getAnimation().animation_size = 0;
        else this.getAnimation().animation_size = tileSize;     
    }
}

class dying{
    constructor(character){
        this.position = character.position;
        this.animation = character.getAnimation();
        showNFrames = Math.floor(2000/GAME_SPEED); //~2 sekunden

        this.frame_cnt = -1;
    }

    updateFrameCnt(){
        if(showNFrames <= 0) {
            board.dyingChars = board.dyingChars.filter(character => character != this); 
            return;
        }
        this.frame_cnt = (this.frame_cnt + 1) % 10;
        showNFrames--;
    }

    setVisability(){
        if(frame_cnt > 6){
            this.animation.dim_x = 0
        }
    }

    getAnimation(){
        return this.getAnimation;
    }
}

