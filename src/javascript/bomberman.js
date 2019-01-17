let  game_canvas, game_ctx;
let  scoreboard_canvas, scoreboard_ctx;
let loading_canvas, loading_canvas_ctx;
let  fontSize = 18; //for matrix anim

//game logic let iables
let  GAME_SPEED = 9; // 1 tick every 9 ms
let  boardWidth = 17; // how many tiles is the gameboard wide?
let  boardHeight = 15; // how many tiles is the gameboard high?
let  tileSize = 32; // how big is one tile? (width and height)
let  baseTileSize = 32; //used for resizing
let  audioPickupItem, audioBombExplode, audioBackground, audioGameOver, audioGameWon, audioTitleScreen;
let  DIRECTION = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };

let  board; // board: saves the information about the current gameboard
let  score_board;
let  player_info;

let  running = false; // game currently on?
let renderIntervalId = null;

//--------------------------------------------------------------------------
window.onload = function () {
	game_canvas = document.getElementById('game_canvas');		// main gameboard
	game_ctx = game_canvas.getContext('2d');
	playerinfo_canvas = document.getElementById('playerinfo');	// player info on the left
	playerinfo_ctx = playerinfo_canvas.getContext('2d');
	scoreboard_canvas = document.getElementById('scoreboard');	// scoreboard on the right
	scoreboard_ctx = scoreboard_canvas.getContext('2d');

	resizeCanvas();
	placeRegisteredPlayerDiv();

	audioBackground = new Audio('../sound/background.mp3');
	audioBombExplode = new Audio('../sound/bombExplode.wav');
	audioPickupItem = new Audio('../sound/itemPickup.wav');
	audioGameOver = new Audio('../sound/gameOver.wav');
	audioGameWon = new Audio('../sound/gameWon.mp3');
	audioTitleScreen = new Audio('../sound/titleScreen.mp3');
	audioBackground.volume = 0.25;
	audioPickupItem.volume = 0.4;
	audioTitleScreen.volume = 0.8;
	audioGameOver.volume = 0.5;
	audioBackground.loop = true;
	audioTitleScreen.loop = true;
	audioTitleScreen.play();

	$("#loadingView").css("display", "none");
	startGame();
};

function resizeCanvas(){
	if(document.body.offsetWidth < 1000){
		tileSize = Math.floor(0.07 * document.body.offsetWidth - 7);
	}
	if(document.body.offsetHeight < 1000){
		let tmp = Math.floor(0.07 * document.body.offsetHeight -  9.6);
		tileSize = Math.min(tileSize, tmp);
	}


	tileSize = Math.max(tileSize, 16); //lower than 16 pixel is not allowed
	tileSize = Math.min(tileSize, baseTileSize); //higher than baseTileSize not allowed

	//resize canvas
	let width = boardWidth * tileSize;
	let height = boardHeight * tileSize;
	game_ctx.canvas.width = width;
	game_ctx.canvas.height = height;
	game_canvas.width = width;
	game_canvas.height = height;
	playerinfo_ctx.canvas.height = height;
	playerinfo_canvas.height = height;
	scoreboard_canvas.height = height;
	scoreboard_ctx.canvas.height = height;

	score_board = new scoreboard();
	player_info = new playerinfoboard();

}

window.onresize = placeRegisteredPlayerDiv;

function placeRegisteredPlayerDiv(){
	let div = $("#registeredPlayers");
	let pos = $("#scoreboard").position();
	div.css("left", pos.left + 30);
	div.css("top", pos.top + 30);
}

function startGame() {
	window.addEventListener("gamepadconnected", function (e) {
		if(!running){
			console.log("Gamepad with index " + e.gamepad.index + " connected");
			if(e.gamepad.index < 4){
				let htmlId = "player" + (e.gamepad.index + 2);
				document.getElementById(htmlId).innerHTML = "Gamepad " + (e.gamepad.index + 1);
				gamepads.push(new gamepadController(e.gamepad));
			}
		}
	});
	//setup an interval for Chrome
	let  checkChrome = window.setInterval(function () {
		if (navigator.getGamepads()[0]) {
			$(window).trigger("gamepadconnected");
			window.clearInterval(checkChrome);
		}
	}, 500);
	window.addEventListener("gamepaddisconnected", function (e) {
		console.log("hm...that's unfortunate");
	});

	board = new gameboard(boardWidth, boardHeight, 0, 0, 0);
	board.draw();

	window.onkeypress = function () {
		window.onkeypress = null;
		audioTitleScreen.pause();
		$("#loadingView").css("display", "inline");
		$("#startView").css("display", "none");
		
		
		setTimeout(function () {
			audioBackground.play();
			nrOfPlayers = 1;
			
			if (gamepads.length !== undefined) nrOfPlayers += gamepads.length;
			board = new gameboard(boardWidth, boardHeight, nrOfPlayers, 10, 0.7, 0.4);
			score_board = new scoreboard(nrOfPlayers);
			
			
			//add key listeners for player Controls
			window.onkeydown = playerKeyDown;
			window.onkeyup = playerKeyUp;
			
			renderIntervalId = setInterval(loop, GAME_SPEED);
			running = true;
			$("#loadingView").css("display", "none");
		  	$("#registeredPlayers").css("display", "none");
		}, 3000);
	  };
}

// is called every 9 ms
function loop() {
	gamepads.forEach(gamepad => gamepad.checkGamepad());
	board.players.forEach(player => movePlayer(player));
	moveEnemies();
	drawScreen();
}

function gameOver(){
	let nrPlayers = board.players.filter(player => player !== undefined).length;
	audioBackground.pause();
	$("#gameOver").css("display", "block");

	if(nrPlayers === 0){
		$("#gameOver text").attr("fill", "red");
		$("#gameOver text").html("GameOver");
		audioGameOver.play();
	}else{
		let winner = score_board.leadingPlayer();
		$("#gameOver text").attr("fill", "green");
		$("#gameOver text").html(`Player ${winner + 1} has won`);
		audioGameWon.play();
	}

	clearInterval(renderIntervalId);
	running = false;
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
	score_board.draw(scoreboard_ctx, board.players);
	player_info.draw(playerinfo_ctx, board.players);

	let playersLeft = board.players.filter(player => player !== undefined).length;
	if (playersLeft === 0 || (board.enemies.length === 0 && playersLeft !== 0)) {
		setTimeout(gameOver, 500);
	}
}
