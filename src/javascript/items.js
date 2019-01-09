const numDifferentItems = 10;

const items = [
    {
        id: 0, 
        effect: function() {
            console.log("add bomb power");
        }
    },
    {
        id: 1,
        effect: function() {
            console.log("increase number of bombs.");
        }
    }
]

class Item {
    constructor(row, col, itemId = 0) {
        this.position = {
            row: row,
            col: col,
            pix_x: col * tileSize,
            pix_y: row * tileSize
        };
        this.itemId = itemId;

        // this only works as long as position of art assets doesn't move
        // it saves the position of where to find the picture in the art assets file
        this.pngRowPos = 11 + Math.floor(itemId / 5) * 3; 
        this.pngColPos = (itemId % 5) * 3;
    }

    getAnimation() {
        return new AnimationFrame(16 * this.pngColPos, 16 * this.pngRowPos, 32, 32);
    }
}