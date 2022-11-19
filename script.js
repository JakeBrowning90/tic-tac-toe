"use strict";

//factory for players, assign name, piece, captured squares, and currentPlayer property
const player = (playerName, gamePiece) => {
    let capturedSquares = [];
    let currentPlayer = false;
    return {playerName, gamePiece, capturedSquares, currentPlayer}; 
};

const player1 = player ("Link", "X");
const player2 = player ("Zelda", "O");

//module for gameboard, array of 9 spaces
const gameBoard = (() => {
    let newGrid = ["", "", "", "", "", "", "", "", ""];
    function freshGrid() {
        let newGrid = ["", "", "", "", "", "", "", "", ""];
    }
    return {newGrid, freshGrid};
})();

//module for display controller
const displayController = (() => {
    const content = document.querySelector(".content")
    //Show player name input

    //Show grid on page
    function drawPlayfield() {
        for (const cell in gameBoard.newGrid) {
            const boardSquare = document.createElement("div");
            boardSquare.classList.add("cell");
            boardSquare.textContent = gameBoard.newGrid[cell];
            boardSquare.addEventListener("click", function(){playerMove(cell)});
            content.appendChild(boardSquare);
        }
        return;
    }

    //update cell contents according to player clicks
    function playerMove(cell) {
       gameBoard.newGrid[cell] = player1.gamePiece;
       refreshGrid();
       drawPlayfield();
    }

    //clear grid display
    function refreshGrid() {
        while (content.firstChild) {
            content.removeChild(content.lastChild);
          }
    }

    //restart game
    function restartGame() {
        refreshGrid();
        gameBoard.freshGrid();
        drawPlayfield();
    }

    return {drawPlayfield, restartGame};
})();

displayController.drawPlayfield();