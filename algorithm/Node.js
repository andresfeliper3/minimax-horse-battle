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
export default class Node {

  constructor(gameboard, iaHorseIndex, father) {
    this.gameboard = gameboard;
    this.iaHorseIndex = iaHorseIndex
    this.father = father
  }

  getFather() {
    return this.father;
  }
  setDepth(depth) {
    this.depth = depth;
  }
  getDepth() {
    return this.depth;
  }
  setType(type) {
    this.type = type;
    if (this.type == MAX) {
      this.utility = -Infinity
    }
    else {
      this.utility = Infinity
    }
  }
  getType() {
    return this.type;
  }
  setUtility(utility) {
    this.utility = utility;
  }
  getUtility() {
    return this.utility;
  }

  setIaHorseIndexSelected(iaHorseIndexSelected) {
    this.iaHorseIndexSelected = iaHorseIndexSelected;
  }
  getIaHorseIndex() {
    return this.iaHorseIndex
  }

  hasNoUtility() {
    return this.utility == Infinity || this.utility == -Infinity;
  }

  /* This function checks if the box is within the limits to move*/
  checkTableLimits(boxIndex) {
    let canMove = false;
    if (
      boxIndex.x >= 0 &&
      boxIndex.x <= 7 &&
      boxIndex.y >= 0 &&
      boxIndex.y <= 7
    ) {
      canMove = true;
    }
    return canMove;
  }

  getDecision() {
    return this.iaHorseIndexSeleted;
  }

  /*This function checks if the box is dominated*/
  checkIfBoxIsDominated(boxIndex) {
    let boxDominated;
    if (
      this.gameboard[boxIndex.y][boxIndex.x] == IA_HORSE ||
      this.gameboard[boxIndex.y][boxIndex.x] == DOMINATED_BY_IA ||
      this.gameboard[boxIndex.y][boxIndex.x] == DOMINATED_BY_PLAYER ||
      this.gameboard[boxIndex.y][boxIndex.x] == PLAYER_HORSE
    ) {
      boxDominated = true;
    }

    return boxDominated;
  }

  /* This function updates the horse valid moves, that is, the possible moves that player's horse can be take   */
  updateValidMoves() {
    this.validMoves = [];
    let possibleMove = {};
    //up
    //up-left
    possibleMove = { x: this.iaHorseIndex.x - 1, y: this.iaHorseIndex.y - 2 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //up-right
    possibleMove = { x: this.iaHorseIndex.x + 1, y: this.iaHorseIndex.y - 2 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //down
    //down-left
    possibleMove = { x: this.iaHorseIndex.x - 1, y: this.iaHorseIndex.y + 2 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //down-right
    possibleMove = { x: this.iaHorseIndex.x + 1, y: this.iaHorseIndex.y + 2 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //left
    //left-top
    possibleMove = { x: this.iaHorseIndex.x - 2, y: this.iaHorseIndex.y - 1 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //left-down
    possibleMove = { x: this.iaHorseIndex.x - 2, y: this.iaHorseIndex.y + 1 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //Right
    //Right-top
    possibleMove = { x: this.iaHorseIndex.x + 2, y: this.iaHorseIndex.y - 1 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //Right-left
    possibleMove = { x: this.iaHorseIndex.x + 2, y: this.iaHorseIndex.y + 1 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
  }

  getValidMoves() {
    return this.validMoves
  }
}