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

    return middleBoardsWon(game, player) + cornerBoardsWon(game, player) + edgeBoardsWon(game, player);
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

function isAThreat(player, a, b, c) {
    /* Helper function that returns true if there is a threat. 
    For example, calling it on a row that is [X win, X win, no winner and still active] returns true */

    if (allSame([player, a, b]) && c === null || allSame([player, a, c]) && b === null || allSame([player, b, c]) && a === null) {
        return true;
    }
    return false;
}

function sendsToFilledBoard(game, row, col) {
    //helper function that returns if a move (given the local coordinates) sends the opponent to a filled board (generally bad)

    if (game.checkLocalGameState(row, col) === null) {
        return false;
    }
    return true;
}

function sigmoid(t) {
    return 2 * 1/(1+Math.pow(Math.E, -t)) - 1;
}

/*

heuristics

*/

//my first attempt at a positional heuristic that combines a bunch of stuff
export default function heuristicA(game) {
    //checks if game over
    if (game.checkGlobalState() !== null) {
        return game.checkGlobalState();
    }

    let player = game.player;
    let count = 0;
    count += 
        
        //your stuff
        middleBoardsWon(game, player) * 10 + 
        edgeBoardsWon(game, player) * 6 + 
        cornerBoardsWon(game, player) * 4 + 
        localMiddlesWon(game, player) * 2 + 
        localCornersWon(game, player) * 1.5 + 
        localEdgesWon(game, player) * 1 + 
        globalWinThreats(game, player) * 10
        
        //your opponent's stuff
        middleBoardsWon(game, -player) * -10 + 
        edgeBoardsWon(game, -player) * -6 + 
        cornerBoardsWon(game, -player) * -4 + 
        localMiddlesWon(game, -player) * -2 + 
        localCornersWon(game, -player) * -1.5 + 
        localEdgesWon(game, -player) * -1 + 
        globalWinThreats(game, -player) * -10;

    //sent to a filled board
    if (game.nextGlobalRow !== null && game.nextGlobalCol !== null) {
        if (sendsToFilledBoard(game, game.nextGlobalRow, game.nextGlobalCol)) {
            count += 5;
        }
    }
    
    return sigmoid(count);
}