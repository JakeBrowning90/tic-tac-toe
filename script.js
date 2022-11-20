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
        newGrid = ["", "", "", "", "", "", "", "", ""];
    }
    return {newGrid, freshGrid};
})();

//module for display controller
const displayController = (() => {
    let gameOver = false;
    const content = document.querySelector(".content")
    const setupScreen = document.createElement("div");
    setupScreen.classList.add("setupScreen");
    const matchScreen = document.createElement("div");
    matchScreen.classList.add("matchScreen");

    //test board reset button
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.classList.add("resetButton");
    resetButton.addEventListener("click", restartGame);
    const footer = document.querySelector(".footer");
    footer.appendChild(resetButton);
    
    //Show player name input
    function drawSetupScreen() {
        const startGame = document.createElement("button");
        startGame.textContent = "Start game";
        startGame.addEventListener('click', function(){
            content.removeChild(setupScreen);
            drawPlayfield();
        });
        setupScreen.appendChild(startGame);
        content.appendChild(setupScreen);
        return;
    }

    //Show grid on page
    function drawPlayfield() {
        content.appendChild(matchScreen);
        for (const cell in gameBoard.newGrid) {
            const boardSquare = document.createElement("div");
            boardSquare.classList.add("cell");
            boardSquare.textContent = gameBoard.newGrid[cell];
            boardSquare.addEventListener("click", function(){playerMove(cell)});
            matchScreen.appendChild(boardSquare);
        }
        return;
    }

    //update cell contents when player clicks on unclaimed cell
    function playerMove(cell) {
        if (gameBoard.newGrid[cell] == "" && gameOver == false) {
        gameBoard.newGrid[cell] = currentPlayer.gamePiece;
        //console.log(gameBoard.newGrid.indexOf(cell));
        currentPlayer.capturedSquares.push(cell);
        console.log(currentPlayer.playerName, currentPlayer.capturedSquares);
        console.log(gameBoard.newGrid);
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
        if (!gameBoard.newGrid.includes("") && gameOver == false) {
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
        while (matchScreen.firstChild) {
            matchScreen.removeChild(matchScreen.lastChild);
          }
    }

    //reset gameboard array, redraw playfield
    function restartGame() {
        gameOver = false;
        gameBoard.newGrid = ["", "", "", "", "", "", "", "", ""];
        player1.capturedSquares = [];
        player2.capturedSquares = [];
        currentPlayer = player1;
        refreshGrid();
        drawPlayfield();
        //return gameBoard.newGrid;
    }

    return {drawPlayfield, drawSetupScreen, restartGame};
})();

displayController.drawSetupScreen();
//displayController.drawPlayfield();