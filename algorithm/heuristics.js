/*
helper functions
*/

import GlobalGame from "../game/globalgame.js";

function allSame(arr) {
    for (const element of arr) {
        if (element !== arr[0]) {
            return false;
        }
    }
    return true;
  }

function countBoardsWon(game, player) {
    //counts the number of boards won by the player
    let count = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (game.checkLocalGameState(i, j) === player) {
                count++;
            }
        }
    }
    return count;
}

function middleBoardsWon(game, player) {
    //notes if the middle board is won, returns 1 if it is

    if (game.checkLocalGameState(1, 1) === player) {
        return 1;
    }
    return 0;
}

function cornerBoardsWon(game, player) {
    //calculates how many corner boards are won

    let count = 0;
    if (game.checkLocalGameState(0, 1) === player) {
        count++;
    }
    if (game.checkLocalGameState(1, 0) === player) {
        count++;
    }
    if (game.checkLocalGameState(2, 1) === player) {
        count++;
    }
    if (game.checkLocalGameState(1, 2) === player) {
        count++;
    }
    return count;
}

function edgeBoardsWon(game, player) {
    //calculates how many edge boards are won
    let count = 0;
    if (game.checkLocalGameState(0, 0) === player) {
        count++;
    }
    if (game.checkLocalGameState(2, 0) === player) {
        count++;
    }
    if (game.checkLocalGameState(2, 2) === player) {
        count++;
    }
    if (game.checkLocalGameState(0, 2) === player) {
        count++;
    }
    return count;
}

function localMiddlesWon(game, player) {
    //calculates how many local middle squares are won

    let count = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (game.checkSquareState(i, j, 1, 1) === player) {
                count++;
            }
        }
    }
    return count;
}

function localCornersWon(game, player) {
    //calculates how many local corner squares are won

    let count = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (game.checkSquareState(i, j, 0, 1) === player) {
                count++;
            }
            if (game.checkSquareState(i, j, 1, 0) === player) {
                count++;
            }
            if (game.checkSquareState(i, j, 2, 1) === player) {
                count++;
            }
            if (game.checkSquareState(i, j, 1, 2) === player) {
                count++;
            }
        }
    }
    return count;
}

function localEdgesWon(game, player) {
    //calculates how many local edge squares are won

    let count = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (game.checkSquareState(i, j, 0, 0) === player) {
                count++;
            }
            if (game.checkSquareState(i, j, 2, 0) === player) {
                count++;
            }
            if (game.checkSquareState(i, j, 2, 2) === player) {
                count++;
            }
            if (game.checkSquareState(i, j, 0, 2) === player) {
                count++;
            }
        }
    }
    return count;
}

function getTurns(game, player) {
    //calculates what turn it is (idk might be useful for something)

    return localMiddlesWon(game, player) + localCornersWon(game, player) + localEdgesWon(game, player);
}

function globalWinThreats(game, player) {
    //calculates number of unblocked pairs of boards (threatening a win)

    let count = 0;
    //row
    for (let i = 0; i < 3; i++) {
        if (isAThreat(player, game.checkLocalGameState(i, 0), game.checkLocalGameState(i, 1), game.checkLocalGameState(i, 2))) {
            count++;
        }
    }
    //column
    for (let j = 0; j < 3; j++) {
        if (isAThreat(player, game.checkLocalGameState(j, 0), game.checkLocalGameState(j, 1), game.checkLocalGameState(j, 2))) {
            count++;
        }
    }
    //diagonal
    if (isAThreat(player, game.checkLocalGameState(0, 0), game.checkLocalGameState(1, 1), game.checkLocalGameState(2, 2))) {
        count++;
    }
    if (isAThreat(player, game.checkLocalGameState(2, 0), game.checkLocalGameState(1, 1), game.checkLocalGameState(0, 2))) {
        count++;
    }
    return count;
}

function localBoardWinThreats(game, player, row, col) {
    //calculates number of unblocked pairs of squares (threatening a local win)

    let count = 0;
    //row
    for (let i = 0; i < 3; i++) {
        if (isAThreat(player, game.checkSquareState(row, col, i, 0), game.checkSquareState(row, col, i, 1), game.checkSquareState(row, col, i, 2))) {
            count++;
        }
    }
    //column
    for (let j = 0; j < 3; j++) {
        if (isAThreat(player, game.checkSquareState(row, col, j, 0), game.checkSquareState(row, col, j, 1), game.checkSquareState(row, col, j, 2))) {
            count++;
        }
    }
    //diagonal
    if (isAThreat(player, game.checkSquareState(row, col, 0, 0), game.checkSquareState(row, col, 1, 1), game.checkSquareState(row, col, 2, 2))) {
        count++;
    }
    if (isAThreat(player, game.checkSquareState(row, col, 2, 0), game.checkSquareState(row, col, 1, 1), game.checkSquareState(row, col, 0, 2))) {
        count++;
    }
    return count;
}

function overallLocalWinThreats(game, player) {
    let count = 0;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            count += localBoardWinThreats(game, player, row, col);
        }
    }
    return count;
}

function isAThreat(player, a, b, c) {
    /* Helper function that returns true if there is a threat of winning a row, col, or diag. 
    For example, calling it on a row that is [X win, X win, no winner and still active] returns true */
    return ((allSame([player, a, b]) && c === null) || (allSame([player, a, c]) && b === null) || (allSame([player, b, c]) && a === null));
}

function sendsToFilledBoard(game, row, col) {
    //helper function that returns if a move (given the local coordinates) sends the opponent to a filled board (generally bad)

    if (game.checkLocalGameState(row, col) === null) {
        return false;
    }
    return true;
}

//goes from -1 to 1 instead of 0 to 1
function sigmoid(t) {
    return 2 * 1/(1+Math.pow(Math.E, -t)) - 1;
}

function isOccupied(localBoard, player) {
    // Returns boolean indicating whether player has occupied any squares in localBoard
    for (const row of localBoard) {
        for (const square of row) {
            if (square.state === player) {
                return true;
            }
        }
    }
    return false;
}

function boardsOccupied(game, player) {
    let count = 0;
    const globalBoard = game.globalBoard;
    for (const row of globalBoard) {
        for (const localGame of row) {
            if (isOccupied(localGame.localBoard, player)) {
                count++;
            }
        }
    }
    return count;
}

/*

heuristics

*/

//my first attempt at a positional heuristic
export default function heuristicA(game) {
    //checks if game over
    if (game.checkGlobalState()[0] !== null) {
        return game.checkGlobalState()[0];
    }

    let heuristic = 0;

    heuristic += 10 * countBoardsWon(game, 1);
    heuristic -= 10 * countBoardsWon(game, -1);

    // heuristic += sigmoid(boardsOccupied(game, -1) / getTurns(game));
    
    heuristic += 2 * overallLocalWinThreats(game, 1);
    heuristic -= 2 * overallLocalWinThreats(game, -1);

    heuristic += 7.5 * globalWinThreats(game, 1);
    heuristic -= 7.5 * globalWinThreats(game, -1);

    heuristic += (game.getValidMoves().length - 9) * (game.player) / 9;

    heuristic /= 5
    // heuristic *= sigmoid(getTurns(game, 1));
    
    return sigmoid(heuristic);
}
