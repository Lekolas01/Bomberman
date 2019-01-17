/* this file contains all the logic for the user controls */


let  KEY = { W: 87, A: 65, S: 83, D: 68, B: 66, Q: 81, SPACE: 32, RIGHT: 39, UP: 38, LEFT: 37, DOWN: 40, NONE: -1 };
let  currently_pressed = []; //keeps track of all relevant keys that are currently pressed
let  bombKeyPressed = false; 
let  gamepads = [];

function playerKeyPress(event) {

}

function playerKeyDown(event) {
	let  key = event.keyCode ? event.keyCode : event.which;
	let  player = board.players[0];

	if(player === undefined) return;
	switch (key) {
		case KEY.DOWN:
		case KEY.UP:
		case KEY.RIGHT:
		case KEY.LEFT:
			currently_pressed[key] = true; //mark that key has been pressed
			board.players[0].updateKey(key);
			break;
		case KEY.SPACE:
		case KEY.B:
			board.players[0].plantBomb();
			break;
	}
}

function playerKeyUp(event) {
	let  key = event.keyCode ? event.keyCode : event.which;
	let  player = board.players[0];
	//console.log(player);
	if (player === undefined) return;
	switch (key) {
		case KEY.DOWN:
		case KEY.UP:
		case KEY.RIGHT:
		case KEY.LEFT:
			currently_pressed[key] = false; //mark that key is no longer pressed
			if (player.lastKeyInput === key) {
				//if released key was the last pressed key
				if (currently_pressed.filter(_key => _key).length === 0) {
					//we have to check, if there is any other (relevant) key pressed
					board.players[0].updateKey(KEY.NONE); //if not, players input is set to none
				} else {
					board.players[0].lastKeyInput = board.players[0].updateKey(currently_pressed.indexOf(true)); //else, we get (one of) the other pressed key(s)
				}
			}
			break;
	}
}

//gamepad in inputcontroler.js
class gamepadController {
    constructor(gamepad, btnA = 0, btnB = 1) {
        this.gamepad = gamepad;
        this.playerId = gamepad.index + 1;
        this.btnA = btnA;
        this.btnB = btnB;
    }

    disconnect() {
        gamepads = gamepads.filter(pad => pad != this);
    }
    checkGamepad() {
        let horizontal = this.gamepad.axes[0];
		let vertical = this.gamepad.axes[1];
		let player = board.players[this.playerId];

        player.lastKeyInput = KEY.NONE; //default if none applies
        if (Math.abs(horizontal) > Math.abs(vertical)) { //is vertical or horizontal axe more strongly pressed
            if (horizontal < -0.5) { //cannot check for ones or zeros, because controller might not be that exact
				player.lastKeyInput = player.updateKey(KEY.LEFT);

            } else if (horizontal > 0.5) {
                player.lastKeyInput = player.updateKey(KEY.RIGHT);
            }
        } else {
            if (vertical < -0.5) {
                player.lastKeyInput = player.updateKey(KEY.UP);
            } else if (vertical > 0.5) {
                player.lastKeyInput = KEY.DOWN;
            }
		}

		//console.log("player id: " + this.playerId + " horizontal: " + this.gamepad.axes[0] + " vertical: " + this.gamepad.axes[1]);

        if (this.gamepad.buttons[this.btnA].pressed || this.gamepad.buttons[this.btnB].pressed) {
            board.players[this.playerId].plantBomb();
        }
    }
}