import React from "React";
import {getText} from "../modules/texts.jsm";
import {PLAYER_TYPE} from '../helpers/constants';
import ComputerPlayer from "./computerPlayer";

const Deck = ({name ,cards, type, moves}, turn, chooseCard, isCardEligible,
              heapCard, pullCard,
              endTaki) => {
    const isPlayer = type === PLAYER_TYPE;
    return (<div className={`deck ${type} ${turn ? 'active' : ''}`}>
        {!!cards.length && cards.map(({type : cardType, color}, i) => {
            const cardEligible = turn && isCardEligible({type: cardType, color});
            return <div key={i}
            className="card"
            {...isPlayer ? {
                    onClick: () => cardEligible && chooseCard(i),
                    'data-card-type': cardType,
                    'data-color': color,
                    className: `card ${cardEligible ? 'active' : 'off'}`
                } : {}
            }
        />})}
        {!isPlayer && turn &&  <ComputerPlayer {...{cards, chooseCard, heapCard, pullCard, isCardEligible, endTaki, turn}}/>}
        <div className="deck-stats">
            <h2>{name}</h2>
            <h3>{getText('totalMoves')} {moves.length - 1}</h3>
        </div>
        {isPlayer && endTaki && <div onClick={endTaki} className="end-taki-btn"/>}
    </div>)
};


export default Deck;