import React from 'react';
import './icon.css';

const Icon = ({ wager, icon = '💰'}) => {

    const scale = (100 + Math.log10(wager) * 30) / 100;

    return (
        <div className="icon-container" style={{ textAlign: 'left', marginTop: '20px', marginLeft: '50px', display: 'flex'}}>
            <div 
                className="icon"
                style={{
                    textAlign: 'left',
                    transform: `scale(${scale})`
                }}
            >
                {icon}
            </div>
        </div>
    );
}

export default Icon;
