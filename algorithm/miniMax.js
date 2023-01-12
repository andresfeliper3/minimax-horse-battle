import { Node } from "./Node";

export class MiniMax {
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