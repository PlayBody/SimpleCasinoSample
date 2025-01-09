import React from 'react';
import './GameOver.css';

const GameOver = ({ isWin, onRestart }) => {
    return (
        <div className="game-over-overlay">
            <div className="game-over-content">
                <h2>{isWin ? "🎉 Congratulations! 😊" : "Game Over 😢"}</h2>
                <button onClick={onRestart}>Play Again</button>
            </div>
        </div>
    );
};

export default GameOver;