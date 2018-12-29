//creates a new matrix of any type
function newMatrix(height, width) {
    var x = new Array(height);
    for(var i = 0; i < width; i++) {
        x[i] = new Array(width);
    }
    return x;
}   