var canvas, ctx;
var fontSize = 18;

var columns = new Array();


//--------------------------------------------------------------------------
window.onload = function(){
    canvas = document.getElementById("bomberman");
    ctx = canvas.getContext("2d");
    initializeAnimation();

    window.onresize = initializeAnimation;

    setInterval(animation, 50);

}

//--------------------------------------------------------------------------
function initializeAnimation() {
	  // set the internal size to match
	  canvas.width  = canvas.offsetWidth;
	  canvas.height = canvas.offsetHeight;

    var numberOfColumns = Math.round(canvas.width / fontSize);
    columns = new Array();
    for (var i = 0; i < numberOfColumns; i++) {
        columns[i] = canvas.height;
    }

}

//--------------------------------------------------------------------------
function animation() {

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#00FF00";
    ctx.font = fontSize + "px Arial";

    for(var i = 0; i < columns.length; i++) {
        ctx.fillText(randomMatrixSymbol(), i * fontSize, columns[i] * fontSize);

        if((columns[i] * fontSize) > canvas.height && Math.random() > 0.975) {
            columns[i] = 0;
        }
        columns[i]++;
    }
}

//--------------------------------------------------------------------------
function randomMatrixSymbol() {
    return String.fromCharCode(Math.floor(
        Math.random() * 26000 + 20000
    ));
}