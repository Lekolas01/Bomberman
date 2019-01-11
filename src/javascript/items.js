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
            case 0: this.increaseBombCount(player, 1); break;
            case 1: this.increaseBombStrength(player, 1); break;
            case 2: this.increaseMoveSpeed(player, 0.5); break;
            default: console.log(" error: item not yet implemented.");
        }
    }

    getAnimation() {
        return new AnimationFrame(16 * this.pngColPos, 16 * this.pngRowPos, 32, 32);
    }

    increaseMoveSpeed(player, value) {
        var newSpeed = Math.min(player.moveSpeed + value, playerMaxStats.moveSpeed);
        player.setSpeed(newSpeed);
    }

    increaseBombCount(player, value) {
        var newBombCount = Math.min(player.maxBombs + value, playerMaxStats.maxBombs);
        player.maxBombs = newBombCount;
    }

    increaseBombStrength(player, value) {
        var newBombStrength = Math.min(player.bombStrength + value, playerMaxStats.bombStrength);
        player.bombStrength = newBombStrength;
    }

    
}