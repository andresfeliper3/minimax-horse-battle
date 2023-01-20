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
    this.playerHorseIndex = index;
  }
  setIaHorseIndex(index) {
    this.iaHorseIndex = index;
  }
  setBonusIndex(index) {
    this.bonusIndex = index;
  }

  executeMinimax() {
    this.nodes = [];
    const initialNode = new Node(
      this.copy(this.initialGameboard),
      this.iaHorseIndex,
      this.playerHorseIndex,
      null,
      MAX,
      this.iaHorseIndex
    );

    initialNode.setDepth(0);
    this.nodes.push(initialNode);

    this.depth = 0;

    while (true) {
      console.log("Profundidad: ", this.depth);
      let objCurrentNode = this.searchByDepth(this.depth);
      while (objCurrentNode == null) {
        this.depth--;
        objCurrentNode = this.searchByDepth(this.depth);
      }
      let { currentNode, currentNodeIndex } = objCurrentNode;
      if (
        currentNode.getDepth() < this.maxDepth &&
        !currentNode.hasExpanded()
      ) {
        const isExpanded = this.expandNode(currentNode);
        if (!isExpanded) {
          currentNode.generateUtility();
          const utility = currentNode.getUtility();
          console.log(
            "LA UTILIDAD ES: ",
            utility,
            "iahorseIndex",
            currentNode.getIaHorseIndex(),
            "playerIndex: ",
            currentNode.getPlayerHorseIndex()
          );
          const father = currentNode.getFather();
          if (father) {
            const utilityChanged = father.setUtility(utility);
            if (utilityChanged) {
              father.setIaHorseIndexSelected(currentNode.getIaHorseIndex());
            }
          } else {
            return currentNode.getIaHorseIndex();
          }

          //delete
          this.nodes.splice(currentNodeIndex, 1);
        }
      }
      //This conditional should only work when the decision must be taken
      else if (currentNode.getDepth() == 0) {
        return currentNode.getDecision();
      } else {
        if (currentNode.getDepth() == this.maxDepth) {
          currentNode.generateUtility();
        }
        const utility = currentNode.getUtility(); //todo: heuristics
        const father = currentNode.getFather();
        const utilityChanged = father.setUtility(utility);
        if (utilityChanged) {
          father.setIaHorseIndexSelected(currentNode.getIaHorseIndex());
        }
        //delete
        this.nodes.splice(currentNodeIndex, 1);
      }
      if (this.depth < this.maxDepth) {
        this.depth++;
      } else if (
        this.depth == this.maxDepth &&
        this.searchByDepth(this.maxDepth) == null
      ) {
        this.depth--;
      }
    }
  }

  copy(matrix) {
    return matrix.map((row) => [...row]);
  }
  expandNode(node) {
    // const horseIndex = node.getHorseIndex();
    const horseIndex =
      node.getType() == MAX
        ? node.getIaHorseIndex()
        : node.getPlayerHorseIndex();

    let validMoves = node.updateValidMoves(horseIndex);
    if (validMoves.length > 0) {
      node.setExpanded();
      validMoves.forEach((move) => {
        let newNode;
        if (node.getType() == MAX) {
          newNode = new Node(
            this.copy(node.getGameboard()),
            move,
            node.getPlayerHorseIndex(),
            node,
            !node.getType(),
            horseIndex
          );
        } else {
          newNode = new Node(
            this.copy(node.getGameboard()),
            node.getIaHorseIndex(),
            move,
            node,
            !node.getType(),
            horseIndex
          );
        }

        newNode.setDepth(node.getDepth() + 1);
        this.nodes.push(newNode);
      });
      return true;
    } else {
      return false;
    }
  }

  searchByDepth(depth) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].getDepth() == depth) {
        return { currentNode: this.nodes[i], currentNodeIndex: i };
      }
    }
    return null;
  }
}
