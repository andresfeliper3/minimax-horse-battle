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
    console.log("BEFORE initial Gameboard", this.initialGameboard)
    const initialNode = new Node(this.copy(this.initialGameboard), this.iaHorseIndex, null, MAX, this.iaHorseIndex)
    console.log("AFTER initial Gameboard", initialNode.getGameboard())

    initialNode.setDepth(0);
    this.nodes.push(initialNode)

    this.depth = 0;

    while (true) {
      console.log("OUTER WHILE, and nodes length", this.nodes.length)
      let objCurrentNode = this.searchByDepth(this.depth);
      while (objCurrentNode == null) {
        console.log("before inner while:", "depth", this.depth, "nodes length", this.nodes.length)

        this.depth--;
        objCurrentNode = this.searchByDepth(this.depth);
        console.log("after inner while:", "depth", this.depth, "nodes length", this.nodes.length)
      }
      let { currentNode, currentNodeIndex } = objCurrentNode;
      if (currentNode.getDepth() < this.maxDepth && !currentNode.hasExpanded()) {
        console.log("currentNode depth", currentNode.getDepth())
        const isExpanded = this.expandNode(currentNode);
        if (!isExpanded) {

          const utility = -1 * currentNode.getUtility();
          const father = currentNode.getFather();
          if (father) {
            const utilityChanged = father.setUtility(utility);
            if (utilityChanged) {
              father.setIaHorseIndexSelected(currentNode.getHorseIndex());
            }
          }
          else {
            return currentNode.getHorseIndex();
          }

          //delete
          this.nodes.splice(currentNodeIndex, 1);
        }
      }
      //This conditional should only work when the decision must be taken
      else if (currentNode.getDepth() == 0) {
        return currentNode.getDecision();
      }
      else {
        if (currentNode.getDepth() == this.maxDepth) {
          currentNode.generateUtility();
          console.log("GENERATED UTILITY in controller", currentNode.getUtility());
        }
        const utility = currentNode.getUtility(); //todo: heuristics
        const father = currentNode.getFather();
        const utilityChanged = father.setUtility(utility);
        if (utilityChanged) {
          father.setIaHorseIndexSelected(currentNode.getHorseIndex());
        }
        //delete
        this.nodes.splice(currentNodeIndex, 1);

      }

      console.log("search by depth", this.searchByDepth(this.maxDepth), "with maxdepth:", this.maxDepth, "and depth:", this.depth)
      if (this.depth < this.maxDepth) {
        this.depth++;
      }
      else if (this.depth == this.maxDepth && this.searchByDepth(this.maxDepth) == null) {
        this.depth--;
        console.log("DEPTH DIMINISHES", this.depth)
      }
    }

  }

  copy(matrix) {
    return matrix.map(row => [...row]);
  }
  expandNode(node) {
    const horseIndex = node.getHorseIndex();
    console.log("IMPRIMÍ ESTOS CABALLOS", this.iaHorseIndex, this.playerHorseIndex)
    console.log("node details: depth", node.getDepth(), "horseindex", node.getHorseIndex())
    console.log("gameboard", node.getGameboard())
    node.updateValidMoves(horseIndex)
    let validMoves = node.getValidMoves()

    console.log("valid moves", node.getValidMoves())
    console.log("horseIndex", horseIndex)
    if (validMoves.length > 0) {
      node.setExpanded();
      validMoves.forEach(move => {
        const newNode = new Node(this.copy(node.getGameboard()), move, node, !node.getType(), horseIndex);
        newNode.setDepth(node.getDepth() + 1);
        console.log("new node depth is: ", newNode.getDepth())
        this.nodes.push(newNode);
      })
      return true;
    }
    else {
      return false;
    }

  }

  searchByDepth(depth) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].getDepth() == depth) {
        // console.log("I FOUND it", this.nodes[i].getHorseIndex())
        return { currentNode: this.nodes[i], currentNodeIndex: i }
      }
    }
    return null;
  }

  printNodes() {
    this.nodes.forEach(node => console.log("nodes depth", node.getDepth()))
  }



}
