/* this file contains all the logic for the user controls */

playerControls = [
    {up: 1, down: 2, left: 3, right: 4, bomb: 5},
    {up: 6, down: 7, left: 8, right: 9, bomb: 10},
    {up: 1, down: 12, left: 13, right: 14, bomb: 15},
    {up: 1, down: 17, left: 18, right: 19, bomb: 20}
];

function playerControlPressed(event) {
	var key = event.keyCode ? event.keyCode : event.which;

	switch (key) {
		case KEY.DOWN:
		case KEY.UP:
		case KEY.RIGHT:
        case KEY.LEFT:
			currently_pressed[key] = true; //mark that key has been pressed
			board.players[0].lastKeyInput = key;
            break;
        case KEY.B:
            if(!bombKeyPressed){
                board.players[0].plantBomb();
            }
            break;
	}
}

function playerControlReleased(event) {
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
		case KEY.B:
			bombKeyPressed = false;
			break;
	}
}