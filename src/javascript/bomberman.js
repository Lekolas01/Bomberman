var canvas, ctx;
var fontSize = 18; //for matrix anim

//game logic variables
var GAME_SPEED = 9; // 1 tick every 9 ms
var boardWidth = 17; // how many tiles is the gameboard wide?
var boardHeight = 13; // how many tiles is the gameboard high?
var tileSize = 32; // how big is one tile? (width and height)
var baseTileSize = 32; //used for resizing
var score = 0;
var audioLayBomb, audioBombExplode, audioBackground, audioDeath, audioGameOver;
var DIRECTION = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };

var board; // board: saves the information about the current gameboard

var running = false; // game currently on?

//--------------------------------------------------------------------------
window.onload = function () {
	canvas = document.getElementById('game_canvas');
	ctx = canvas.getContext('2d');
	resizeCanvas();

	//background music
	// note: sometimes background music doesn't play,
	// because the background music loads asynchronously
	audioBackground = new Audio('../sound/background.mp3');
	audioBackground.loop = true;
	// audioBackground.play();

	startGame();
};

function resizeCanvas(){
	if(document.body.offsetWidth < 1000){
		tileSize = Math.floor(0.06 * document.body.offsetWidth - 7);
	}
	if(document.body.offsetHeight < 1000){
		let tmp = Math.floor(0.07 * document.body.offsetHeight -  9.6);  //calculated with linear regression
		tileSize = Math.min(tileSize, tmp);
	}

	tileSize = Math.max(tileSize, 16); //lower than 16 pixel is not allowed
	tileSize = Math.min(tileSize, baseTileSize); //higher than baseTileSize not allowed

	//resize canvas
	let width = boardWidth * tileSize;
	let height = boardHeight * tileSize;
	ctx.canvas.width = width;
	ctx.canvas.height = height;
	canvas.width = width;
	canvas.height = height;
	alert(tileSize);
}

function startGame() {
	running = true;
	//startView.setAttribute("visibility", "hidden");
	//TODO: init player, init monsters

	//printAllEnemiesStats(board.enemies);

	//add key listeners for player Controls
	window.addEventListener("gamepadconnected", function (e) {
		console.log("Gamepad with index " + e.gamepad.index + " connected");
		gamepads.push(new gamepadController(e.gamepad));
	});
	//setup an interval for Chrome
	var checkChrome = window.setInterval(function () {
		if (navigator.getGamepads()[0]) {
			$(window).trigger("gamepadconnected");
			window.clearInterval(checkChrome);
		}
	}, 500);
	window.addEventListener("gamepaddisconnected", function (e) {
		console.log("hm...that's unfortunate");
	});

	board = new gameboard(boardWidth, boardHeight, 4, 0, 0);
	board.draw();

	window.onkeypress = function () {
		nrOfPlayers = 1;
		
		if(gamepads.length !== undefined) nrOfPlayers += gamepads.length;
		board = new gameboard(boardWidth, boardHeight, nrOfPlayers, 10, 0.7);

		//add key listeners for player Controls
		window.onkeydown = playerKeyDown;
		window.onkeyup = playerKeyUp;

		renderIntervalId = setInterval(loop, GAME_SPEED);
		window.onkeypress = null;
	};
}

// is called every 9 ms
function loop() {
	gamepads.forEach(gamepad => gamepad.checkGamepad());
	board.players.forEach(player => movePlayer(player));
	moveEnemies();
	drawScreen();
}

function movePlayer(player) {
	let pix_offset = 0;
	let frame_cnt = 0;
	player.updateFrameCnt();
	frame_cnt = player.frame_cnt;
	if (frame_cnt === 0) {
		player.updateDirection();
		player.tryMove(board);
		player.refreshPos();
	}
	pix_offset = tileSize - ((tileSize / player.speed) * (frame_cnt % player.speed) + 1);
	player.refreshPixelPos(pix_offset);
}

function moveEnemies() {
	let pix_offset = 0;
	let frame_cnt = 0;
	for (let i = 0; i < board.enemies.length; i++) {
		board.enemies[i].updateFrameCnt();
		frame_cnt = board.enemies[i].frame_cnt;
		if (frame_cnt === 0) {
			board.enemies[i].chooseMovingDirection(board);
			board.enemies[i].refreshPos(); // change position in Matrix (row, col)
		}
		pix_offset = tileSize - ((tileSize / board.enemies[i].speed) * (frame_cnt % board.enemies[i].speed) + 1); //in MOVEMENT_SPEED frames (eg. 60 Frames) character moves 1 Tile.
		//So Every Frame, we add 1/60 of a tile to the current moving direction
		//This way, the characters position changes 60/60  (= whole tile) of a tile in the whole 60 frames
		board.enemies[i].refreshPixelPos(pix_offset);
		board.enemies[i].kill();
	}
}
//--------------------------------------------------------------------------
function drawScreen() {
	board.draw();
	//TODO: 
	//scoreBoard.draw(ctx);
}
