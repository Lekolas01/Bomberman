/* this file contains all the logic for the user controls */


var KEY = { W: 87, A: 65, S: 83, D: 68, B: 66, Q: 81, SPACE: 32, RIGHT: 39, UP: 38, LEFT: 37, DOWN: 40, NONE: -1 };
var currently_pressed = []; //keeps track of all relevant keys that are currently pressed
var bombKeyPressed = false; 
var gamepads = [];


playerControls = [
	{ up: 1, down: 2, left: 3, right: 4, bomb: 5 },
	{ up: 6, down: 7, left: 8, right: 9, bomb: 10 },
	{ up: 1, down: 12, left: 13, right: 14, bomb: 15 },
	{ up: 1, down: 17, left: 18, right: 19, bomb: 20 }
];

function playerKeyPress(event) {

}

function playerKeyDown(event) {
	var key = event.keyCode ? event.keyCode : event.which;

	switch (key) {
		case KEY.DOWN:
		case KEY.UP:
		case KEY.RIGHT:
		case KEY.LEFT:
			currently_pressed[key] = true; //mark that key has been pressed
			board.players[0].lastKeyInput = key;
			break;
		case KEY.SPACE:
		case KEY.B:
			board.players[0].plantBomb();
			break;
	}
}

function playerKeyUp(event) {
	var key = event.keyCode ? event.keyCode : event.which;
	var player = board.players[0];

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
					board.players[0].lastKeyInput = KEY.NONE; //if not, players input is set to none
				} else {
					board.players[0].lastKeyInput = currently_pressed.indexOf(true); //else, we get (one of) the other pressed key(s)
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

        board.players[this.playerId].lastKeyInput = KEY.NONE; //default if none applies
        if (Math.abs(horizontal) > Math.abs(vertical)) { //is vertical or horizontal axe more strongly pressed
            if (horizontal < -0.5) { //cannot check for ones or zeros, because controller might not be that exact
				board.players[this.playerId].lastKeyInput = KEY.LEFT;
            } else if (horizontal > 0.5) {
                board.players[this.playerId].lastKeyInput = KEY.RIGHT;
            }
        } else {
            if (vertical < -0.5) {
                board.players[this.playerId].lastKeyInput = KEY.UP;
            } else if (vertical > 0.5) {
                board.players[this.playerId].lastKeyInput = KEY.DOWN;
            }
		}

		//console.log("player id: " + this.playerId + " horizontal: " + this.gamepad.axes[0] + " vertical: " + this.gamepad.axes[1]);

        if (this.gamepad.buttons[this.btnA].pressed || this.gamepad.buttons[this.btnB].pressed) {
            board.players[this.playerId].plantBomb();
        }
    }
}