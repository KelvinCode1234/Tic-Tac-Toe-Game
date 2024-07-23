const gameCells = document.querySelectorAll('.cell');
const YOU = document.querySelector('.YOU');
const LIMA = document.querySelector('.LIMA');
const restartBtn = document.querySelector('.restartBtn');
const alertBox = document.querySelector('.alertBox');

let currentPlayer = 'X';
let nextPlayer = 'O';
let playerTurn = currentPlayer;

YOU.textContent = `YOU: ${currentPlayer}`;
LIMA.textContent = `LIMA: ${nextPlayer}`;

const startGame = () => {
    gameCells.forEach(cell => {
        cell.addEventListener('click', handleClick);
    });
    playerTurn = currentPlayer;
    showAlert(`Turn for player: ${playerTurn}`);
}

const handleClick = (e) => {
    if (e.target.textContent === '' && playerTurn === currentPlayer) {
        e.target.textContent = playerTurn;
        if (checkWin()) {
            showAlert(`${playerTurn} is a Winner!!`, true);
            disableCells();
        } else if (checkTie()) {
            showAlert(`It's a Tie!`);
            disableCells();
        } else {
            changePlayerTurn();
            showAlert(`Turn for player: ${playerTurn}`);
            if (playerTurn === nextPlayer) {
                makeAIMove();
            }
        }
    }
}


const makeAIMove = () => {
    const bestMove = getBestMove();
    gameCells[bestMove].textContent = nextPlayer;
    if (checkWin()) {
        showAlert(`${nextPlayer} is a Winner!!`, true);
        disableCells();
    } else if (checkTie()) {
        showAlert(`It's a Tie!`);
        disableCells();
    } else {
        changePlayerTurn();
        showAlert(`Turn for player: ${playerTurn}`);
    }
}

const changePlayerTurn = () => {
    playerTurn = playerTurn === currentPlayer ? nextPlayer : currentPlayer;
}

const checkWin = () => {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < winningConditions.length; i++) {
        const [pos1, pos2, pos3] = winningConditions[i];
        if (gameCells[pos1].textContent !== '' && 
            gameCells[pos1].textContent === gameCells[pos2].textContent &&
            gameCells[pos2].textContent === gameCells[pos3].textContent) {
            return true;
        }
    }
    return false;
}

const checkTie = () => {
    let emptyCellscount = 0;
    gameCells.forEach(cell => {
        if (cell.textContent === '') {
            emptyCellscount++;
        }
    });
    return emptyCellscount === 0 && !checkWin();
}

const disableCells = () => {
    gameCells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
        cell.classList.add('disabled');
    });
}

const restartGame = () => {
    gameCells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled');
    });
    startGame();
}

const showAlert = (msg, isWin) => {
    alertBox.textContent = msg;
    alertBox.style.display = "block";
    setTimeout(() => {
        alertBox.style.display = "none";
    }, isWin ? 5000 : 3000);
}

const getBestMove = () => {
    let bestMove = -1;
    let bestValue = -Infinity;
    gameCells.forEach((cell, index) => {
        if (cell.textContent === '') {
            cell.textContent = nextPlayer;
            let moveValue = minimax(false);
            cell.textContent = '';
            if (moveValue > bestValue) {
                bestMove = index;
                bestValue = moveValue;
            }
        }
    });
    // Apply the 25% win chance for human
    if (Math.random() > 0.75) {
        const emptyCells = [];
        gameCells.forEach((cell, index) => {
            if (cell.textContent === '') {
                emptyCells.push(index);
            }
        });
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    return bestMove;
}

const minimax = (isMaximizing) => {
    if (checkWin()) {
        return isMaximizing ? -1 : 1;
    }
    if (checkTie()) {
        return 0;
    }

    if (isMaximizing) {
        let bestValue = -Infinity;
        gameCells.forEach(cell => {
            if (cell.textContent === '') {
                cell.textContent = nextPlayer;
                bestValue = Math.max(bestValue, minimax(false));
                cell.textContent = '';
            }
        });
        return bestValue;
    } else {
        let bestValue = Infinity;
        gameCells.forEach(cell => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer;
                bestValue = Math.min(bestValue, minimax(true));
                cell.textContent = '';
            }
        });
        return bestValue;
    }
}

restartBtn.addEventListener('click', restartGame);

startGame();
