import React, { useState, useEffect, useRef } from 'react';
import Icon from './icon';
//import Character from './Character';
import './GameBoard.css';

const GameBoard = () => {
    const [gameState, setGameState] = useState('betting'); // 'betting', 'playing', 'gameover'

    const [currentIcon, setCurrentIcon] = useState('💰');
    const [iconSize, setIconSize] = useState(1);

    const [balance, setBalance] = useState(100);
    const [betAmount, setBetAmount] = useState(100);
    const [currentAmount, setCurrentAmount] = useState(100);

    const [isAnimation, setIsAnimation] = useState(false);
    const [sniffCount, setSniffCount] = useState(0);

    const [prizeMultiplier, setPrizeMultiplier] = useState(1);
    const [currentWager, setCurrentWager] = useState(1);

    const [messageKey, setMessageKey] = useState(0);
    const [resultMessage, setResultMessage] = useState('START SNIFFING!');
    
    const [currentProb, setCurrentProb ] = useState(1);

    const [items, setItems] = useState([]); // Store all the rectangles
    const [characterImg, setCharacterImg] = useState('/assets/prepare.png'); // Store the character path
   
    const multipliers = [1, 1.5, 2, 3, 5, 7.5, 10, 12.5, 15, 20, 25, 50, 100];
    const survivalFactors = [1, 0.75, 0.5, 0.3, 0.2, 0.15, 0.1, 0.05, 0.03, 0.02, 0.01, 0.005];
    const numbers = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN'];
    const canvasRef = useRef(null);

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
            setItems([]);
            setGameState('playing');
            setCurrentIcon('😎');
            setIconSize(1);
            setCurrentAmount(betAmount);
            let newBalance = balance - betAmount;
            setBalance(newBalance);

            setCurrentProb(1);
            setSniffCount(0);
            setIsAnimation(0);
            setPrizeMultiplier(1);
            setResultMessage('START SNIFFING!');
            setCurrentWager(1);

            const canvasWidth = 400;
            const Width = canvasWidth / 18; // Width of each rectangle
            const Height = 30;

            for(let i = 0; i < 11; i++){
                const posX = 180 + 13 * (i % 11);
                const posY = 290 + 25 * Math.floor(sniffCount / 11);
        
                // Add a new rectangle to the items array
                const newItem = {
                    ox: posX,
                    oy: posY,
                    cx: posX,
                    cy: posY,
                    width: Width,
                    height: Height,
                    color: 'lightblue',
                    opacity: 1, // Start visible
                    circles: [],
                };
        
                for(let i = 0; i < 50; i++){
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 5;
                    const offsetY = Math.sin(angle) * distance * 4;
                    const offsetX = Math.cos(angle) * distance / 2 + offsetY * 0.7;
                    
                    newItem.circles.push({x: offsetX, y: offsetY, radius: Math.random() * 3, alpah: Math.max(Math.random() * 2)});
                }
        
                setItems((prev) => [...prev, newItem]);
            }
    
        }
        else{
            alert('Input valid bet amount.');
        }
    };

    const quitGame = () => {
        setGameState('gameover');
        setBalance(balance + betAmount * prizeMultiplier);
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

    let startTime = null;

    const animatedNextLine = () => {
        // Start animation to move all items towards the center
        const targetX = 200; // Center X position of the canvas
        const targetY = 30; // Center Y position of the canvas

        // Update the position and opacity of each item
        setItems((prevItems) => {
            return prevItems.map((item, index) => {
                if(index === sniffCount){
                    const speed = 0.1; // Animation speed (between 0 and 1)
                    const newOpacity = Math.max(0, item.opacity - 0.05); // Fade out items
    
                    // Calculate the new position
                    const newX = item.cx + (targetX - item.cx) * speed;
                    const newY = item.cy + (targetY - item.cy) * speed;
    
                    // Return the updated item with new position and opacity
                    return { ...item, cx: newX, cy: newY, opacity: newOpacity };
                    }
                    return item;
            });
        });

        const timestamp = Date.now();

        if (!startTime) startTime = timestamp;

        // Continue animating if any item hasn't reached the target
        if(timestamp - startTime < 800){
            requestAnimationFrame(animatedNextLine);
        }
        else{
            setCharacterImg('/assets/prepare.png'); // Change the character image

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
                setPrizeMultiplier(0);
                setCurrentAmount(0);
                quitGame();
                return;
            }

            setCurrentAmount(betAmount * prizeMultiplier);
            setIsAnimation(false);
            setCurrentAmount(betAmount * prizeMultiplier);
        }
    };

    const handleNextLine = () => {
        if (isAnimation) return; // Prevent action while animating

        handleSniff();

        setIsAnimation(true);
        startTime = null;
        setCharacterImg('/assets/sniffing.png'); // Change the character image

        // Start the animation
        animatedNextLine();

    };

    const handleSniff = () => {
        if (sniffCount >= 11) return;

        let newSniffCount = sniffCount + 1;
        setSniffCount(newSniffCount);
        let newPrizeMultiplier = multipliers[newSniffCount];
        setPrizeMultiplier(newPrizeMultiplier);
        setMessageKey(prev => prev + 1);
        setResultMessage(`YOU DID ${numbers[newSniffCount]} LINE${newSniffCount>1?'S':''}!`);

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
        if(isAnimation) return;

        setResultMessage(`You cashed out with $${currentAmount}!`);
        let newBalance = balance + currentAmount;
        setBalance(newBalance)
        quitGame();
    };

    // eslint-disable-next-line
    const drawItems = (ctx) => {
        items.forEach((item) => {
            ctx.fillStyle = item.color;

            item.circles.forEach(circle => {
                ctx.fillStyle = `rgba(255, 255, 255, ${circle.alpah * (1 - (1 - item.opacity) * 0.9)})`;
                ctx.beginPath();
                ctx.arc(item.ox + circle.x, item.oy + circle.y, circle.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            item.circles.forEach(circle => {
                ctx.fillStyle = `rgba(255, 255, 255, ${circle.alpah * item.opacity})`;
                ctx.beginPath();
                ctx.arc(item.cx + circle.x, item.cy + circle.y, circle.radius, 0, Math.PI * 2);
                ctx.fill();
            });

        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas){
            console.log('Canvas not found');
            return;
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        drawItems(ctx); // Draw all items
    }, [items, drawItems]); // Redraw items whenever they change

    if (gameState === 'betting') {
        return (
            <div style={{ textAlign: 'left', marginLeft: '50px', marginTop: '20px' }}>
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
                <Icon wager={betAmount} icon = {currentIcon} />
            </div>
        );
    }

    if (gameState === 'gameover') {
        return (
            <div className="container" >
            <div className="game-info">
                <div className='character-container'>
                    <img src={characterImg} alt='Sniffing Character' className='character-image' width={400} height={350}/>
                    <canvas id='mycanvas' ref={canvasRef} width='400' height='350'></canvas>
                </div>
                <div className="game-controls">
                <p>{currentAmount === 0 ? "YOU OD'D" : 'YOU EARN $' + betAmount * prizeMultiplier}</p>
                <button onClick={handleRestart}
                    >
                        PLAY AGAIN
                </button>
                </div>
            </div>
            <div className='icon-container'>
                <Icon wager={iconSize} icon = {currentIcon} />
            </div>
        </div>
        );
    }

    return (
        <div className="container" >
            <div className="game-info">
                <div className='character-container'>
                    <img src={characterImg} alt='Sniffing Character' className='character-image' width={400} height={350}/>
                    <canvas id='mycanvas' ref={canvasRef} width='400' height='350'></canvas>
                </div>
                <div className="game-controls">
                <p>YOUR BET: ${betAmount.toFixed(2)}</p>
                <p key={messageKey} className="message-animation">{resultMessage}</p>
                    <p style={{ fontWeight: 'bold' }}>DO ANOTHER LINE?</p>
                    <button onClick={handleNextLine}
                    >
                        SNIFF FOR ${multipliers[sniffCount+1]}X
                    </button>
                    <p>CASH OUT</p>
                    <button className='cash-out-button'
                        onClick={handleCashOut}
                        >
                            Cash Out <br/>${betAmount * prizeMultiplier}
                    </button>
                </div>
            </div>
            <div className='icon-container'>
                <Icon wager={iconSize} icon = {currentIcon} />
            </div>
        </div>
    );
};

export default GameBoard;