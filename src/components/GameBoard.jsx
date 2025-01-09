import React, { useState } from 'react';
import Character from './Character';
import './GameBoard.css';

const GameBoard = () => {
    const [gameState, setGameState] = useState('betting'); // 'betting', 'playing', 'gameover'
    const [currentIcon, setCurrentIcon] = useState('💰');
    const [iconSize, setIconSize] = useState(1);

    const [balance, setBalance] = useState(100);
    const [betAmount, setBetAmount] = useState(100);
    const [currentAmount, setCurrentAmount] = useState(100);

    const [lineNumber, setLineNumber] = useState(0);
    const [sniffCount, setSniffCount] = useState(0);

    const [prizeMultiplier, setPrizeMultiplier] = useState(1);
    const [currentWager, setCurrentWager] = useState(1);

    const [messageKey, setMessageKey] = useState(0);
    const [resultMessage, setResultMessage] = useState('You can start sniffing now.');
    
    const [currentProb, setCurrentProb ] = useState(1);
    const multipliers = [1, 1.5, 2, 3, 5, 7.5, 10, 12.5, 15, 20, 25, 50, 100];
    const survivalFactors = [1, 0.75, 0.5, 0.3, 0.2, 0.15, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005];

    const handleAllIn = () => {
        setBetAmount(balance);
        console.log(currentIcon);
    }

    const handleBetAmountChange = (e) => {
        const value = Math.max(1, Math.min(balance, Number(e.target.value)));
        setBetAmount(value);
        setCurrentAmount(value);
    };

    const handleBetSubmit = () => {
        if (betAmount <= balance && betAmount > 0) {
            setGameState('playing');
            setCurrentIcon('😎');
            setIconSize(1);
            setCurrentAmount(betAmount);
            let newBalance = balance - betAmount;
            setBalance(newBalance);

            setCurrentProb(1);
            setSniffCount(0);
            setLineNumber(0);
            setPrizeMultiplier(1);
            setResultMessage('You can start sniffing now.');
            setCurrentWager(1);
            }
        else{
            alert('Input valid bet amount.');
        }
    };

    const quitGame = () => {
        setGameState('gameover');
        setSniffCount(0);
        setPrizeMultiplier(1);
        setResultMessage('You can start sniffing now.');
        setCurrentWager(1);
    }

    const handleRestart = () => {
        setGameState('betting');
        setCurrentIcon('💰');
        if(balance === 0){
            alert("You are run out of balance. I will give you $100 as gift");
            setBalance(100);
            setBetAmount(100);
        }
    }

    const handleNextLine = () => {
        let newProb = currentProb * survivalFactors[sniffCount];

        if(newProb > 0.5){
            setCurrentIcon('😇');
        }
        else if(newProb > 0.25){
            setCurrentIcon('🤑');
        }
        else{
            setCurrentIcon('😈');
        }

        if (Math.random() > newProb) {
            setResultMessage('OVERDOSE! You lose.');
            setCurrentAmount(0);
            quitGame();
            return;
        }

        setCurrentProb(newProb);

        setLineNumber(prev => prev + 1); // Increment line number
        let newWager = currentWager * prizeMultiplier;
        setCurrentWager(newWager);

        setCurrentAmount(currentAmount * prizeMultiplier);
        setSniffCount(0);
        setResultMessage('You can start sniffing now.');
    };

    const handleSniff = () => {
        if (sniffCount >= 11) return;
        
        let newSniffCount = sniffCount + 1;
        setSniffCount(newSniffCount);
        let newPrizeMultiplier = multipliers[newSniffCount];
        setPrizeMultiplier(newPrizeMultiplier);
        setMessageKey(prev => prev + 1);
        setResultMessage(`You sniffed ${newSniffCount} on this line${'!'.repeat(newSniffCount)}`);

        let newProb = currentProb * survivalFactors[newSniffCount];

        if(newProb > 0.75){
            setCurrentIcon('😇');
        }
        else if(newProb > 0.5){
            setCurrentIcon('🤩');
        }
        else if(newProb > 0.3){
            setCurrentIcon('🤪');
        }
        else if(newProb > 0.2){
            setCurrentIcon('🤑');
        }
        else if(newProb > 0.1){
            setCurrentIcon('🤡');
        }
        else{
            setCurrentIcon('😈');
        }

        setIconSize(currentWager * newPrizeMultiplier);
    };

    const handleCashOut = () => {
        setResultMessage(`You cashed out with $${currentAmount}!`);
        let newBalance = balance + currentAmount;
        setBalance(newBalance)
        quitGame();
    };

    if (gameState === 'betting') {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h1>Sniff To Win!</h1>
                <p>Balance: ${balance.toFixed(2)}</p>
                <div className="betting-controls">
                    <input
                        type="number"
                        value={betAmount}
                        onChange={handleBetAmountChange}
                        min="1"
                        max={balance}
                        style={{ fontSize: '24px', margin: '20px' }}
                    />
                    <button 
                        onClick={handleBetSubmit}
                        disabled={betAmount > balance || betAmount <= 0}
                        style={{ fontSize: '24px' }}
                    >
                        Bet
                    </button>
                    <button 
                        onClick={handleAllIn}
                        style={{ fontSize: '24px' }}
                    >
                        All In!
                    </button>
                </div>
                <Character wager={betAmount} icon = {currentIcon} />
            </div>
        );
    }

    if (gameState === 'gameover') {
        return (
            <div className="game-over">
                <div className="game-over-content">
                    <h1>{currentAmount > 0 ? "🎉 You Won!" : "😢 Game Over"}</h1>
                    <h2>Final Balance: ${balance.toFixed(2)}</h2>
                    <button onClick={handleRestart}>Play Again</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Sniff To Win!</h1>
            <p>Betting Amount: ${betAmount.toFixed(2)} Balance: ${balance.toFixed(2)} </p>
            <button 
                onClick={handleSniff} 
                disabled={sniffCount >= 11}
                style={{ opacity: sniffCount >= 11 ? 0.5 : 1 }}
            >
                Sniff
            </button>
            <p style={{ fontWeight: 'bold' }}>Line Number: {lineNumber}</p>
            <p style={{ fontWeight: 'bold' }}>DO ANOTHER LINE</p>
            <p key={messageKey} className="message-animation">{resultMessage}</p>
            <p>Prize Multiplier: {prizeMultiplier}x</p>
            <button onClick={handleNextLine}
                disabled={sniffCount === 0}
                style={{ opacity: sniffCount === 0 ? 0.5 : 1 }}
            >
                Sniff To Win!
            </button>
            <button
                onClick={handleCashOut}
                disabled={lineNumber === 0}
                style={{ opacity: lineNumber === 0 ? 0.5 : 1 }}
                >
                    Cash Out ${currentAmount.toFixed(2)}
            </button>
            <Character wager={iconSize} icon = {currentIcon} />
        </div>
    );
};

export default GameBoard;