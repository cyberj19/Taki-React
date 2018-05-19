import React from "React";
import {getText} from "../modules/texts.jsm";
import {PLAYER_TYPE} from '../helpers/constants';

const Deck = ({name ,cards, type, moves}, turn, chooseCard) => {
    const isPlayer = type === PLAYER_TYPE;
    return (<div className={`deck ${type} ${turn ? 'active' : ''}`}>
        <div className="deck-stats">
            <h2>{name}</h2>
            <h3>{getText('totalMoves')} {moves.length}</h3>
        </div>
        {!!cards.length && cards.map(({type : cardType, color}, i) => <div
            key={i}
            className="card"
            onClick={() => {isPlayer && turn && chooseCard(i)}}
            data-card-type={isPlayer ? cardType : null}
            data-color={isPlayer ? color : null}/>)}
    </div>)
};


export default Deck;