/* this file contains all the logic for the user controls */


let KEY = { W: 87, A: 65, S: 83, D: 68, B: 66, Q: 81, SPACE: 32, RIGHT: 39, UP: 38, LEFT: 37, DOWN: 40, NONE: -1 };
let currently_pressed = []; //keeps track of all relevant keys that are currently pressed
let bombKeyPressed = false;
let gamepads = [];

function playerKeyPress(event) {

}

function playerKeyDown(event) {
	let key = event.keyCode ? event.keyCode : event.which;
	let player = board.players[0];

	if (player === undefined) return;
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
	let key = event.keyCode ? event.keyCode : event.which;
	let player = board.players[0];
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
	constructor(gamepad, player_indx, btnA = 0, btnB = 1, dpad_up = 12, dpad_down = 13, dpad_left = 14, dpad_right = 15) {
		this.gamepad = gamepad;
		this.playerId = player_indx;
		this.btnA = btnA;
		this.btnB = btnB;
		this.dpad_up = dpad_up;
		this.dpad_down = dpad_down;
		this.dpad_left = dpad_left;
		this.dpad_right = dpad_right;

		this.bombBtn_newPress = true; //used to avoid multible bombs beeing planeted despite the key was pressed only once
	}

	disconnect(died = true) {//when died === true, player disconects because of gameplay. else because controller was removed
		if (died) {
			gamepads = gamepads.filter(pad => pad != this);
			console.log("Gamepad with index " + this.gamepad.index + " disconnected. Belonging to Player " + (this.playerId + 1));
		} else if (board.players[this.playerId] !== undefined) {
			board.players[this.playerId].die(); //when gamepad is disconnected mid game, that player dies
		}
	}

	checkGamepad() {
		if (board.players[this.playerId] === undefined) {
			this.disconnect();
			return;
		}

		let player = board.players[this.playerId];

		if (this.gamepad.buttons[this.btnA].pressed || this.gamepad.buttons[this.btnB].pressed) {
			if (this.bombBtn_newPress) {
				board.players[this.playerId].plantBomb();
				this.bombBtn_newPress = false;
			}
		} else {
			this.bombBtn_newPress = true;
		}


		if (!this.checkDPad(player)) { //if no direction on dpad was pressed, joystick is checked
			this.checkLeftJoystick(player);
		}
	}
	checkLeftJoystick(player) {
		let horizontal = this.gamepad.axes[0];
		let vertical = this.gamepad.axes[1];

		if (Math.abs(horizontal) > Math.abs(vertical)) { //is vertical or horizontal axe more strongly pressed
			if (horizontal < -0.5) { //cannot check for ones or zeros, because controller might not be that exact
				player.updateKey(KEY.LEFT);
				return;
			} else if (horizontal > 0.5) {
				player.updateKey(KEY.RIGHT);
				return;
			}
		} else {
			if (vertical < -0.5) {
				player.updateKey(KEY.UP);
				return;
			} else if (vertical > 0.5) {
				player.updateKey(KEY.DOWN);
				return;
			}
		}
		player.updateKey(KEY.NONE); //if no other Key applied
	}

	checkDPad(player) {
		let dpad = this.gamepad.buttons;

		if (dpad[this.dpad_left].pressed) {
			player.updateKey(KEY.LEFT);
			return true;
		} else if (dpad[this.dpad_right].pressed) {
			player.updateKey(KEY.RIGHT);
			return true;
		} else if (dpad[this.dpad_up].pressed) {
			player.updateKey(KEY.UP);
			return true;
		} else if (dpad[this.dpad_down].pressed) {
			player.updateKey(KEY.DOWN);
			return true;
		} else {
			return false;
		}
	}
}