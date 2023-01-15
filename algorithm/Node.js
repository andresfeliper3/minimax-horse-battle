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

  constructor(gameboard, horseIndex, father, type, previousHorseIndex) {
    this.type = type;
    this.previousHorseIndex = previousHorseIndex;
    this.horseIndex = horseIndex;
    this.gameboard = gameboard;
    this.gameboard[horseIndex.y][horseIndex.x] = type == MAX ? IA_HORSE : PLAYER_HORSE;
    this.gameboard[previousHorseIndex.y][previousHorseIndex.x] = type == MAX ? DOMINATED_BY_IA : DOMINATED_BY_PLAYER;
    this.father = father
  }

  getGameboard() {
    return this.gameboard;
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
  getHorseIndex() {
    return this.horseIndex
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
  updateValidMoves(horseIndex) {
    this.validMoves = [];
    let possibleMove = {};
    //up
    //up-left
    possibleMove = { x: horseIndex.x - 1, y: horseIndex.y - 2 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //up-right
    possibleMove = { x: horseIndex.x + 1, y: horseIndex.y - 2 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //down
    //down-left
    possibleMove = { x: horseIndex.x - 1, y: horseIndex.y + 2 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //down-right
    possibleMove = { x: horseIndex.x + 1, y: horseIndex.y + 2 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //left
    //left-top
    possibleMove = { x: horseIndex.x - 2, y: horseIndex.y - 1 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //left-down
    possibleMove = { x: horseIndex.x - 2, y: horseIndex.y + 1 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //Right
    //Right-top
    possibleMove = { x: horseIndex.x + 2, y: horseIndex.y - 1 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
    //Right-left
    possibleMove = { x: horseIndex.x + 2, y: horseIndex.y + 1 };
    if (this.checkTableLimits(possibleMove) && !this.checkIfBoxIsDominated(possibleMove)) {
      this.validMoves.push(possibleMove);
    }
  }

  getValidMoves() {
    return this.validMoves
  }
}