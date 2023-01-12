export class Node {
    constructor(gameboard) {
        this.gameboard = gameboard;
    }

    setDepth(depth) {
        this.depth = depth;
    }
    setType(type) {
        this.type = type;
    }
    setUtility(utility) {
        this.utility = utility;
    }
}