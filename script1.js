const NUM_ROWS = 9;
const NUM_COLS = 9;
const NUM_MINES = 15;
const POINTS_PER_STEP = 10; // Points for each correct step

let board = [];
let gameOver = false;
let score = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0; // Retrieve high score from local storage
let totalTiles = NUM_ROWS * NUM_COLS;
let revealedTiles = 0;

const gameBoard = document.getElementById("game-board");
const gameOverOptions = document.getElementById("game-over-options");
const resultDiv = document.getElementById("result");
const scoreSpan = document.getElementById("score");
const highScoreSpan = document.getElementById("highscore");
const winMessage = document.getElementById("win-message");

function initializeBoard() {
    gameOver = false;
    revealedTiles = 0; // Reset revealed tiles count
    score = 0; // Reset score for a new game
    board = [];
    for (let row = 0; row < NUM_ROWS; ++row) {
        board[row] = [];
        for (let col = 0; col < NUM_COLS; ++col) {
            board[row][col] = {
                isMine: false,
                isRevealed: false,
                count: 0
            };
        }
    }

    let mines = 0;
    while (mines < NUM_MINES) {
        const randomRow = Math.floor(Math.random() * NUM_ROWS);
        const randomCol = Math.floor(Math.random() * NUM_COLS);

        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true;
            mines++;
        }
    }

    for (let row = 0; row < NUM_ROWS; ++row) {
        for (let col = 0; col < NUM_COLS; ++col) {
            if (!board[row][col].isMine) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const iLoc = row + dx;
                        const jLoc = col + dy;

                        if (iLoc >= 0 && iLoc < NUM_ROWS && jLoc >= 0 && jLoc < NUM_COLS) {
                            if (board[iLoc][jLoc].isMine) {
                                count++;
                            }
                        }
                    }
                }
                board[row][col].count = count;
            }
        }
    }
}

function render() {
    gameBoard.innerHTML = "";
    for (let row = 0; row < NUM_ROWS; ++row) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'board-row';
        for (let col = 0; col < NUM_COLS; ++col) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (board[row][col].isRevealed) {
                tile.classList.add('revealed');
                if (board[row][col].isMine) {
                    tile.classList.add('mine');
                    tile.textContent = '💣';
                } else if (board[row][col].count > 0) {
                    tile.textContent = board[row][col].count;
                }
            }
            tile.addEventListener('click', () => revealTile(row, col));
            rowDiv.appendChild(tile);
        }
        gameBoard.appendChild(rowDiv);
    }
}

function revealTile(row, col) {
    if (gameOver) return; // Prevent any actions if the game is over
    if (row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS && !board[row][col].isRevealed) {
        board[row][col].isRevealed = true;
        revealedTiles++;
        
        if (!gameOver) {
            score += POINTS_PER_STEP; // Add points for correct step
        }

        if (board[row][col].isMine) {
            gameOver = true;
            gameOverOptions.style.display = 'block';
            resultDiv.style.display = 'block';
            scoreSpan.textContent = score; // Show score when game ends
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore); // Save new high score
            }
            highScoreSpan.textContent = highScore;
        } else if (board[row][col].count === 0) {
            for (let dx = -1; dx <= 1; ++dx) {
                for (let dy = -1; dy <= 1; ++dy) {
                    revealTile(row + dx, col + dy);
                }
            }
        }
        checkForWin(); // Check for win condition
        render();
    }
}

function checkForWin() {
    // If all non-mine tiles are revealed, the player wins
    if (revealedTiles === totalTiles - NUM_MINES) {
        gameOver = true;
        gameOverOptions.style.display = 'block';
        resultDiv.style.display = 'block';
        scoreSpan.textContent = score; // Show score when game ends
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore); // Save new high score
        }
        highScoreSpan.textContent = highScore;
        winMessage.style.display = 'block';
        setTimeout(() => {
            winMessage.style.display = 'none';
        }, 5000); // Hide win message after 5 seconds
    }
}

function restartGame() {
    initializeBoard();
    render();
    resultDiv.style.display = 'none';
    gameOverOptions.style.display = 'none';
    winMessage.style.display = 'none';
}

// Initialize and render the board
initializeBoard();
render();

