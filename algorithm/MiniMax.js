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

export default class MiniMax {
  constructor(initialGameboard) {
    this.initialGameboard = initialGameboard;
  }

  setMaxDepth(maxDepth) {
    this.maxDepth = maxDepth;
  }

  setPlayerHorseIndex(index){
    this.playerHorseIndex = index
  }
  setIaHorseIndex(index){
    this.iaHorseIndex = index
  }
  setBonusIndex(index){
    this.bonusIndex = index
  }

  executeMinimax(){
    this.nodes = []
    const initialNode = new Node(this.initialGameboard, this.iaHorseIndex, null)
    this.nodes.push(initialNode)
    initialNode.updateValidMoves()
    let validMoves = initialNode.getValidMoves()

    validMoves.forEach(move=>{
      this.nodes.push (new Node(this.initialGameboard,move,initialNode))
    })

    
  }
  getDecision() {
    return { x: 2, y: 2 };
  }

  
}
