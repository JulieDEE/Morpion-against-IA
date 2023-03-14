import React, { useState, useEffect } from 'react';

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontals
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // verticals
  [0, 4, 8], [2, 4, 6], // diagonals
];

const initialState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  winner: null,
};

const Morpion = () => {
    const [gameState, setGameState] = useState(initialState);

    const handleCellClick = (index) => {
        if (gameState.board[index] || gameState.winner) return;

        const newBoard = [...gameState.board];
        newBoard[index] = gameState.currentPlayer;

        setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
        winner: calculateWinner(newBoard),
        });
    };

    useEffect(() => {
    if (gameState.currentPlayer === 'O' && !gameState.winner) {
        setTimeout(() => {
        const index = findBestMove(gameState.board);
        handleCellClick(index);
        }, 500);
    }
    }, [gameState.board, gameState.currentPlayer, gameState.winner]);

    const renderCell = (index) => {
        return (
        <div
            className="cell"
            onClick={() => handleCellClick(index)}
        >
            {gameState.board[index]}
        </div>
        );
    };

    const renderBoard = () => {
        return (
        <div className="board">
            {gameState.board.map((cell, index) => (
            <div key={index} className="board-row">
                {renderCell(index)}
            </div>
            ))}
        </div>
        );
    };

    const renderStatus = () => {
    if (gameState.winner) {
        return `Gagnant: joueur ${gameState.winner} 🥳`;
    } else if (gameState.board.every((cell) => cell !== null)) {
        return 'Egalité ! 😐';
    } else {
        return `C'est au tour du joueur: ${gameState.currentPlayer}`;
    }
    };

    const restartGame = () => {
        setGameState(initialState);
    };
        
        const calculateWinner = (board) => {
    for (let i = 0; i < WINNING_LINES.length; i++) {
        const [a, b, c] = WINNING_LINES[i];
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
        }
    }
    return null;
    };

    const findBestMove = (board) => {
    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = 'O';
        const score = minimax(newBoard, false);
        if (score > bestScore) {
            bestScore = score;
            bestMove = i;
        }
        }
    }
    return bestMove;
    };

    const minimax = (board, isMaximizing) => {
        const winner = calculateWinner(board);
        if (winner === 'X') return -1;
        if (winner === 'O') return 1;
        if (board.every((cell) => cell !== null)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    const newBoard = [...board];
                    newBoard[i] = 'O';
                    const score = minimax(newBoard, false);
                    bestScore = Math.max(bestScore, score);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    const newBoard = [...board];
                    newBoard[i] = 'X';
                    const score = minimax(newBoard, true);
                    bestScore = Math.min(bestScore, score);
                }
            }
            return bestScore;
        }
    };
    

    return (
        <div className="game">
        <h1 className='text-3xl font-black mb-4'>Tic Tac Toe</h1>
        {renderBoard()}
        <div className="status">{renderStatus()}</div>
        <button className="restart" onClick={restartGame}>
            Recommencer
        </button>
        </div>
    );

};

export default Morpion
