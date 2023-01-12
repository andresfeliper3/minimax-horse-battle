import Node from "./Node.js";

export default class MiniMax {
    constructor(initialGameboard) {
        this.initialGameboard = initialGameboard;
    }

    setMaxDepth(maxDepth) {
        this.maxDepth = maxDepth;
    }

    setTurn(turn) {
        this.turn = turn;
    }


}