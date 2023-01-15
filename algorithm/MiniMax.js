import Node from "./Node.js";

/** GAMEBOARD CONSTANTS */
const EMPTY = 0;
const PLAYER_HORSE = 1;
const IA_HORSE = 2;
const BONUS = 3;
const DOMINATED_BY_PLAYER = 4;
const DOMINATED_BY_IA = 5;
const IA_TURN = true;
const PLAYER_TURN = false;

const MAX = true;
const MIN = false;

export default class MiniMax {
  constructor(initialGameboard) {
    this.initialGameboard = initialGameboard;
  }

  setMaxDepth(maxDepth) {
    this.maxDepth = maxDepth;
  }

  setPlayerHorseIndex(index) {
    this.playerHorseIndex = index
  }
  setIaHorseIndex(index) {
    this.iaHorseIndex = index
  }
  setBonusIndex(index) {
    this.bonusIndex = index
  }

  executeMinimax() {
    this.nodes = []
    const initialNode = new Node(this.initialGameboard, this.iaHorseIndex, null, MAX, this.iaHorseIndex)
    initialNode.setDepth(0);
    initialNode.setType(MAX);
    this.nodes.push(initialNode)

    this.depth = 0;

    while (true) {
      let { currentNode, currentNodeIndex } = this.searchByDepth(this.depth);
      while (!currentNode) {
        this.depth--;
        currentNode = this.searchByDepth(this.depth);
      }

      if (currentNode.getDepth() < this.maxDepth && currentNode.hasNoUtility()) {
        this.expandNode(currentNode);
      }
      //This conditional should only work when the decision must be taken
      else if (currentNode.getDepth == 0) {
        return currentNode.getDecision();
      }
      else {
        const utility = currentNode.getUtility(); //todo: heuristics
        const father = currentNode.getFather();
        const utilityChanged = father.setUtility(utility);
        if (utilityChanged) {
          father.setIaHorseIndexSelected(currentNode.getHorseIndex());
        }
        //delete
        this.nodes = this.nodes.filter((node, index) => {
          index != currentNodeIndex
        });
      }

      if (this.depth < this.maxDepth) {
        this.depth++;
      }
      else if (this.depth == this.maxDepth && this.searchByDepth(this.maxDepth) == null) {
        this.depth--;
      }
    }

  }


  expandNode(node) {
    const horseIndex = node.getType() == MAX ? this.iaHorseIndex : this.playerHorseIndex;
    node.updateValidMoves(horseIndex)
    let validMoves = node.getValidMoves()

    validMoves.forEach(move => {

      const newNode = new Node(node.getGameboard(), move, node, !node.getType(), horseIndex);
      newNode.setDepth(node.getDepth() + 1);
      this.nodes.push(newNode);
    })
  }

  searchByDepth(depth) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].getDepth() == depth) {
        return { currentNode: this.nodes[i], currentNodeIndex: i }
      }
    }
    return null;
  }

  getDecision() {
    return { x: 2, y: 2 };
  }



}
