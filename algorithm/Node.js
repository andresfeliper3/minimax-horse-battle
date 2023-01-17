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
  constructor(
    gameboard,
    iaHorseIndex,
    playerHorseIndex,
    father,
    type,
    previousHorseIndex
  ) {
    this.type = type;
    this.gameboard = gameboard;
    this.playerHorseIndex = playerHorseIndex;
    this.previousHorseIndex = previousHorseIndex;
    this.iaHorseIndex = iaHorseIndex;

    if (this.type == MAX) {
      this.utility = -Infinity;
      if (
        this.gameboard[this.playerHorseIndex.y][this.playerHorseIndex.x] ==
        BONUS
      ) {
        this.dominateAdjacents(this.playerHorseIndex, DOMINATED_BY_PLAYER);
      }
    } else {
      this.utility = Infinity;
      if (this.gameboard[this.iaHorseIndex.y][this.iaHorseIndex.x] == BONUS) {
        this.dominateAdjacents(this.iaHorseIndex, DOMINATED_BY_IA);
      }
    }
    this.gameboard[iaHorseIndex.y][iaHorseIndex.x] = IA_HORSE;
    this.gameboard[playerHorseIndex.y][playerHorseIndex.x] = PLAYER_HORSE;
    this.father = father;
    if (type == MAX) {
      if (this.father) {
        this.gameboard[this.father.getPlayerHorseIndex().y][
          this.father.getPlayerHorseIndex().x
        ] = DOMINATED_BY_PLAYER;
      }
    } else {
      this.gameboard[this.father.getIaHorseIndex().y][
        this.father.getIaHorseIndex().x
      ] = DOMINATED_BY_IA;
    }
  }

  getPreviousHorseIndex() {
    return this.previousHorseIndex;
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
      this.utility = -Infinity;
    } else {
      this.utility = Infinity;
    }
  }
  getType() {
    return this.type;
  }
  setUtility(utility) {
    if (this.type == MAX) {
      if (utility >= this.utility) {
        this.utility = utility;
        return true;
      }
    } else {
      if (utility <= this.utility) {
        this.utility = utility;
        return true;
      }
    }
    return false;
  }
  getUtility() {
    return this.utility;
  }

  setIaHorseIndexSelected(iaHorseIndexSelected) {
    this.iaHorseIndexSelected = iaHorseIndexSelected;
  }
  getIaHorseIndex() {
    return this.iaHorseIndex;
  }
  getPlayerHorseIndex() {
    return this.playerHorseIndex;
  }

  hasExpanded() {
    return this.expanded;
  }
  setExpanded() {
    this.expanded = true;
  }

  generateUtility() {
    // this.updateValidMoves(this.horseIndex)
    // let myPossibleMovesAmount = this.validMoves.length;
    // let fatherPossibleMovesAmount = this.father.getValidMoves().length; //todo

    let dominated = this.countDominatedBoxes();
    let dominatedByMax = dominated[0];
    let dominatedByMin = dominated[1];
    let playerValidMoves = this.updateValidMoves(this.playerHorseIndex).length;
    let iaValidMoves = this.updateValidMoves(this.iaHorseIndex).length;

    this.utility =
      dominatedByMax - dominatedByMin + (iaValidMoves - playerValidMoves);
    console.log(
      "GENERATED UTILITY in Node",
      this.utility,
      "bymax",
      dominatedByMax,
      "byMin",
      dominatedByMin,
      "type",
      this.type
    );
    console.log("GAMEBOARD IN TERMINAL NODE", this.gameboard);
  }

  countDominatedBoxes() {
    let dominatedByMax = 0;
    let dominatedByMin = 0;
    for (let y = 0; y < this.gameboard.length; y++) {
      for (let x = 0; x < this.gameboard[y].length; x++) {
        if (
          this.gameboard[y][x] == DOMINATED_BY_IA ||
          this.gameboard[y][x] == IA_HORSE
        ) {
          dominatedByMax++;
        } else if (
          this.gameboard[y][x] == DOMINATED_BY_PLAYER ||
          this.gameboard[y][x] == PLAYER_HORSE
        ) {
          dominatedByMin++;
        }
      }
    }
    return [dominatedByMax, dominatedByMin];
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
    console.log("NODE: getDecision", this.iaHorseIndexSelected);
    return this.iaHorseIndexSelected;
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
    let validMoves = [];
    let possibleMove = {};
    //up
    //up-left
    possibleMove = { x: horseIndex.x - 1, y: horseIndex.y - 2 };

    if (
      this.checkTableLimits(possibleMove) &&
      !this.checkIfBoxIsDominated(possibleMove)
    ) {
      validMoves.push(possibleMove);
    }
    //up-right
    possibleMove = { x: horseIndex.x + 1, y: horseIndex.y - 2 };

    if (
      this.checkTableLimits(possibleMove) &&
      !this.checkIfBoxIsDominated(possibleMove)
    ) {
      validMoves.push(possibleMove);
    }
    //down
    //down-left
    possibleMove = { x: horseIndex.x - 1, y: horseIndex.y + 2 };

    if (
      this.checkTableLimits(possibleMove) &&
      !this.checkIfBoxIsDominated(possibleMove)
    ) {
      validMoves.push(possibleMove);
    }
    //down-right
    possibleMove = { x: horseIndex.x + 1, y: horseIndex.y + 2 };

    if (
      this.checkTableLimits(possibleMove) &&
      !this.checkIfBoxIsDominated(possibleMove)
    ) {
      validMoves.push(possibleMove);
    }
    //left
    //left-top
    possibleMove = { x: horseIndex.x - 2, y: horseIndex.y - 1 };

    if (
      this.checkTableLimits(possibleMove) &&
      !this.checkIfBoxIsDominated(possibleMove)
    ) {
      validMoves.push(possibleMove);
    }
    //left-down
    possibleMove = { x: horseIndex.x - 2, y: horseIndex.y + 1 };

    if (
      this.checkTableLimits(possibleMove) &&
      !this.checkIfBoxIsDominated(possibleMove)
    ) {
      validMoves.push(possibleMove);
    }
    //Right
    //Right-top
    possibleMove = { x: horseIndex.x + 2, y: horseIndex.y - 1 };

    if (
      this.checkTableLimits(possibleMove) &&
      !this.checkIfBoxIsDominated(possibleMove)
    ) {
      validMoves.push(possibleMove);
    }
    //Right-left
    possibleMove = { x: horseIndex.x + 2, y: horseIndex.y + 1 };

    if (
      this.checkTableLimits(possibleMove) &&
      !this.checkIfBoxIsDominated(possibleMove)
    ) {
      validMoves.push(possibleMove);
    }
    return validMoves;
  }

  /*This function dominates the boxes adjacents to the bonus*/
  dominateAdjacents(horseIndex, dominate) {
    let possibleBox = {};
    console.log("Dominating adjacents: ", horseIndex, dominate);
    //left
    possibleBox = { x: horseIndex.x - 1, y: horseIndex.y };
    console.log(possibleBox);
    if (
      this.checkTableLimits(possibleBox) &&
      !this.checkIfBoxIsDominated(possibleBox)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = dominate;
    }
    //right
    possibleBox = { x: horseIndex.x + 1, y: horseIndex.y };
    console.log(possibleBox);
    if (
      this.checkTableLimits(possibleBox) &&
      !this.checkIfBoxIsDominated(possibleBox)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = dominate;
    }
    //up
    possibleBox = { x: horseIndex.x, y: horseIndex.y - 1 };
    console.log(possibleBox);
    if (
      this.checkTableLimits(possibleBox) &&
      !this.checkIfBoxIsDominated(possibleBox)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = dominate;
    }
    //down
    possibleBox = { x: horseIndex.x, y: horseIndex.y + 1 };
    console.log(possibleBox);
    if (
      this.checkTableLimits(possibleBox) &&
      !this.checkIfBoxIsDominated(possibleBox)
    ) {
      this.gameboard[possibleBox.y][possibleBox.x] = dominate;
    }
  }
}
