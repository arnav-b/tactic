import LocalGame from "./localgame.js";

function allSame(arr) {
  for (const element of arr) {
      if (element !== arr[0]) {
          return false;
      }
  }
  return true;
}

export default class GlobalGame {

  //Represents the overall board, made up of 9 local boards
  constructor(globalBoard = null, player = 1, nextGlobalRow = null, nextGlobalCol = null) {
    this._player = player;
    this._nextGlobalRow = nextGlobalRow;
    this._nextGlobalCol = nextGlobalCol;

    if (globalBoard) {
      this._globalBoard = globalBoard;
    }
    else {
      globalBoard = [[new LocalGame(), new LocalGame(), new LocalGame()],
                     [new LocalGame(), new LocalGame(), new LocalGame()],
                     [new LocalGame(), new LocalGame(), new LocalGame()]]
      this._globalBoard = globalBoard; 
    }
  }

  get player() {
    return this._player;
  }

  get globalBoard() {
    return this._globalBoard;
  }

  get nextGlobalRow() {
    return this._nextGlobalRow;
  }

  get nextGlobalCol() {
    return this._nextGlobalCol;
  }

  getlocalGame(row, col) {
    return this.globalBoard[row][col];
  }

  copyGlobalBoard() {
    let newGlobalBoard = [];
    for (let r = 0; r < 3; r++) {
      let row = [];
      for (let c = 0; c < 3; c++) {
        row.push(this.globalBoard[r][c].copy());
      }
      newGlobalBoard.push(row);
    }
    return newGlobalBoard;
  }

  isValidMove(globalRow, globalCol, localRow, localCol) {
    let localGame = this.globalBoard[globalRow][globalCol];
    if (localGame.checkLocalState()) {
      // game already won
      return false;
    } else if (localGame.localBoard[localRow][localCol].state) {
      // space already filled
      return false;
    } else if (this.nextGlobalRow === null && this.nextGlobalCol === null) {
      return true;
    } else if (this.nextGlobalRow === globalRow && this.nextGlobalCol === globalCol) {
      return true;
    } else {
      return false;
    }
  }

  makeGlobalMove(globalRow, globalCol, localRow, localCol) {
    let newGlobalBoard = this.copyGlobalBoard();
    newGlobalBoard[globalRow][globalCol] = this.getlocalGame(globalRow, globalCol).makeLocalMove(this.player, localRow, localCol);
    if (newGlobalBoard[localRow][localCol].checkLocalState() === null) {
      const nextGlobalRow = localRow;
      const nextGlobalCol = localCol;
      return new GlobalGame(newGlobalBoard, -1 * this.player, nextGlobalRow, nextGlobalCol);
    } else {
      return new GlobalGame(newGlobalBoard, -1 * this.player);
    }
  }

  checkRowWin() {
    for (let i = 0; i < 3; i++) {
      if (allSame([1, this.globalBoard[i][0].checkLocalState(), this.globalBoard[i][1].checkLocalState(), this.globalBoard[i][2].checkLocalState()])) {
        return 1;
      } else if (allSame([-1, this.globalBoard[i][0].checkLocalState(), this.globalBoard[i][1].checkLocalState(), this.globalBoard[i][2].checkLocalState()])) {
        return -1;
      }
    }
    return None;
  }

  checkColWin() {
    for (let j = 0; j < 3; j++) {
      if (allSame([1, this.globalBoard[0][j].checkLocalState(), this.globalBoard[1][j].checkLocalState(), this.globalBoard[2][j].checkLocalState()])) {
        return 1;
      } else if (allSame([-1, this.globalBoard[0][j].checkLocalState(), this.globalBoard[1][j].checkLocalState(), this.globalBoard[2][j].checkLocalState()])) {
        return -1;
      }
    }
    return None;
  }

  checkDiagWin() {
    //top left to bottom right
    if (allSame([1, this.globalBoard[0][0].checkLocalState(), this.globalBoard[1][1].checkLocalState(), this.globalBoard[2][2].checkLocalState()])) {
      return 1;
    }
    if (allSame([-1, this.globalBoard[0][0].checkLocalState(), this.globalBoard[1][1].checkLocalState(), this.globalBoard[2][2].checkLocalState()])) {
      return -1;
    }
    //top right to bottom left
    if (allSame([1, this.globalBoard[2][0].checkLocalState(), this.globalBoard[1][1].checkLocalState(), this.globalBoard[0][2].checkLocalState()])) {
      return 1;
    }
    if (allSame([-1, this.globalBoard[2][0].checkLocalState(), this.globalBoard[1][1].checkLocalState(), this.globalBoard[0][2].checkLocalState()])) {
      return -1;
    }
    return None;
  }

  checkGlobalState() {
    if (checkRowWin() === 1 || checkColWin() === 1 || checkDiagWin() === 1) {
      return 1;
    }
    if (checkRowWin() === -1 || checkColWin() === -1 || checkDiagWin() === -1) {
      return -1;
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (getlocalGame(i, j).checkLocalState() === null) {
          return null;
        }
      }
    }
    return 0;
  }

  playerColor() {
    if (this.player === 1) {
      return "rgb(0, 0, 255)";
    } else {
      return "rgb(255, 165, 0)";
    }
  }

  draw(ctx, xGlobal, yGlobal, globalBoardSize = 675) {
    /* ctx: canvas.getContext element to draw on
    width, height: width and height of the canvas 
    Note that the board is centered in the screen;
    default dimensions 675px * 675px. */
    let localBoardSize = globalBoardSize / 3;

    for (let row = 0; row < 3; row++) {
      let xLocal = xGlobal + (localBoardSize * row);

      for (let col = 0; col < 3; col++) {
        let yLocal = yGlobal + (localBoardSize * col);
        let game = this.getlocalGame(row, col);
            
          // Color spaces if valid
          let isFree = (this.nextGlobalRow === row && this.nextGlobalCol === col) || (this.nextGlobalRow === null && this.nextGlobalCol === null);
          if (isFree && !game.checkLocalState()) {
            game.draw(ctx, xLocal, yLocal, localBoardSize, this.playerColor());
          } else {
            game.draw(ctx, xLocal, yLocal, localBoardSize);
          }   
        }
    }  
  }
}