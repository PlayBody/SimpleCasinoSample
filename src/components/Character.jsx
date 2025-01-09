import React from 'react';
import './Character.css';

const Character = ({ wager, icon = '💰'}) => {

    const scale = (100 + Math.log10(wager) * 30) / 100;

    return (
        <div className="character-container">
            <div 
                className="character"
                style={{
                    transform: `scale(${scale})`
                }}
            >
                {icon}
            </div>
        </div>
    );
}

export default Character;
