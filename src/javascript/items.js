const numDifferentItems = 3;


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

    updatePlayer(player, item) {
        switch(item.itemId) {
            case 0: player.maxBombs++; break;
            case 1: player.bombStrength++; break;
            case 2: player.runningSpeed++; break;
            default: console.log(" error: item not yet implemented.");
        }
    }

    getAnimation() {
        return new AnimationFrame(16 * this.pngColPos, 16 * this.pngRowPos, 32, 32);
    }
}