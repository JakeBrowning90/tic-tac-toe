"use strict";

//factory for players, assign name, piece, captured squares
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
    const matchGrid = document.createElement("div");
    matchGrid.classList.add("matchGrid");
    const playerDisplay = document.createElement("div");
    playerDisplay.classList.add("playerDisplay");
    const resultsDisplay = document.createElement("div");
    resultsDisplay.classList.add("resultsDisplay");

    //test board reset button
    const resetButton = document.createElement("button");
    resetButton.textContent = "Rematch";
    resetButton.classList.add("resetButton");
    resetButton.addEventListener("click", restartGame);
    const homeButton = document.createElement("button");

    //test return to homescreen button
    homeButton.textContent = "Change players";
    homeButton.classList.add("homeButton");
    homeButton.addEventListener("click", changePlayers);
    const footer = document.querySelector(".footer");
    // footer.appendChild(resetButton);
    // footer.appendChild(homeButton);
    
    //Show player name input
    function drawSetupScreen() {
        const player1Label = document.createElement("label");
        player1Label.setAttribute("for", "player1Input");
        player1Label.textContent = "Player 1 (X): ";
        const player1Input = document.createElement("input");
        player1Input.setAttribute("required", "");
        player1Input.setAttribute("id", "player1Input");
        player1Input.setAttribute("name", "player1Input");

        const player2Label = document.createElement("label");
        player2Label.setAttribute("for", "player2Label");
        player2Label.textContent = "Player 2 (O): ";
        const player2Input = document.createElement("input");
        player2Input.setAttribute("required", "");
        player2Input.setAttribute("id", "player2Input");
        player2Input.setAttribute("name", "player2Input");

        const startGame = document.createElement("button");
        startGame.textContent = "Start game";
        startGame.addEventListener('click', function(){
            player1.playerName = player1Input.value; 
            player2.playerName = player2Input.value; 
            content.removeChild(setupScreen);
            drawPlayfield();
        });
        setupScreen.appendChild(player1Label);
        setupScreen.appendChild(player1Input);
        setupScreen.appendChild(player2Label);
        setupScreen.appendChild(player2Input);
        setupScreen.appendChild(startGame);
        content.appendChild(setupScreen);
        return;
    }

    //Show grid on page
    function drawPlayfield() {
        clearContent();
        content.appendChild(playerDisplay);
        playerDisplay.textContent = currentPlayer.playerName + "'s turn";
        content.appendChild(matchGrid);
        for (const cell in gameBoard.newGrid) {
            const boardSquare = document.createElement("div");
            boardSquare.classList.add("cell");
            boardSquare.textContent = gameBoard.newGrid[cell];
            boardSquare.addEventListener("click", function(){playerMove(cell)});
            matchGrid.appendChild(boardSquare);
        }
        content.appendChild(resultsDisplay);
        resultsDisplay.appendChild(resetButton);
        resultsDisplay.appendChild(homeButton);
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
            let winner = winningOutcomes[set].every(i => 
                currentPlayer.capturedSquares.includes(i));
            if (winner == true) {
                // Set flag to prevent further moves
                resultsDisplay.textContent = currentPlayer.playerName + " wins!"
                gameOver = true;
            }
        }
    }

    function tieCheck(){
        //check if any free cells remain
        if (!gameBoard.newGrid.includes("") && gameOver == false) {
            resultsDisplay.textContent = "Tie game"
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

    //reset gameboard array, redraw playfield
    function restartGame() {
        gameOver = false;
        gameBoard.newGrid = ["", "", "", "", "", "", "", "", ""];
        player1.capturedSquares = [];
        player2.capturedSquares = [];
        currentPlayer = player1;
        playerDisplay.textContent = "";
        resultsDisplay.textContent = "";
        refreshGrid();
        clearContent();
        drawPlayfield();
        //return gameBoard.newGrid;
    }

    function changePlayers() {
        restartGame();
        refreshGrid();
        clearContent();
        refreshSetup();
        drawSetupScreen();
    }

    //clear grid display
    function refreshGrid() {
        while (matchGrid.firstChild) {
            matchGrid.removeChild(matchGrid.lastChild);
            }
    }

     //clear grid display
     function refreshSetup() {
        while (setupScreen.firstChild) {
            setupScreen.removeChild(setupScreen.lastChild);
            }
    }
    
    //Clear whole content div
    function clearContent() {
        while (content.firstChild) {
            content.removeChild(content.lastChild);
        }
    }

    return {drawPlayfield, drawSetupScreen, restartGame};
})();

displayController.drawSetupScreen();
//displayController.drawPlayfield();