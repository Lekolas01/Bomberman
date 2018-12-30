var audioBackground;

window.onload = function () {
    audioBackground = new Audio("music/background.ogg");
    audioBackground.loop = true;
    

    window.onresize = resize;
    resize();
}