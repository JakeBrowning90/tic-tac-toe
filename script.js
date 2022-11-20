"use strict";

//factory for players, assign name, piece, captured squares, and currentPlayer property
const player = (playerName, gamePiece) => {
    let capturedSquares = [];
    return {playerName, gamePiece, capturedSquares}; 
};

const player1 = player ("Link", "X");
const player2 = player ("Zelda", "O");
let currentPlayer = player1;

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
    let gameOver = false;
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

    //update cell contents when player clicks on unclaimed cell
    function playerMove(cell) {
        if (gameBoard.newGrid[cell] == "" && gameOver == false) {
        gameBoard.newGrid[cell] = currentPlayer.gamePiece;
        //console.log(gameBoard.newGrid.indexOf(cell));
        currentPlayer.capturedSquares.push(cell);
        //console.log(currentPlayer.playerName, currentPlayer.capturedSquares);
        //console.log(gameBoard.newGrid);
        winnerCheck();
        tieCheck()
        playerSwap();
        refreshGrid();
        drawPlayfield();
        }
    }

    //check for winner
    function winnerCheck() {
        //Check if current player's captured cells include winning combinations
        const winningOutcomes = [
            ["0", "1", "2"],
            ["3", "4", "5"],
            ["6", "7", "8"],
            ["0", "3", "6"],
            ["1", "4", "7"],
            ["2", "5", "8"],
            ["0", "4", "8"],
            ["2", "4", "6"]];
        for (const set in winningOutcomes) {
            //console.log(winningOutcomes[set]);
            let winner = winningOutcomes[set].every(i => 
                currentPlayer.capturedSquares.includes(i));
            if (winner == true) {
                // Set flag to prevent further moves
                console.log(currentPlayer.playerName + " wins!");
                gameOver = true;
            }
        }
    }

    function tieCheck(){
        //check if any free cells remain
        if (!gameBoard.newGrid.includes("")) {
            console.log("Tie game");
            gameOver = true;
        }
    }

    //change active player between turns
    function playerSwap() {
        if (currentPlayer == player1) {
            currentPlayer = player2
        }
        else if (currentPlayer == player2) {
            currentPlayer = player1
        }
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