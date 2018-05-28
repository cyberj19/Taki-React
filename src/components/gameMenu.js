import React from "react";
import Deck from "./deck"
import {
    PLAYER_TYPE,
    COMPUTER_TYPE,
    HEAP_TYPE,
    ACTION_CHOOSE_CARD,
    ACTION_INIT_PACK,
    ACTION_PULL_CARD
} from '../helpers/constants';
import {
    cardsColors,
    regularCards,
    unColoredCards,
    UNCOLORED_COLOR,
    CARDS
} from "../modules/cards.mjs";
import Timer from './timer';
import {getText, toTimeString} from "../modules/texts.mjs";
import Dialog from "./dialog";



class GameMuenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {players, startTime, endTime} = this.props,
            turns = players.reduce((acc, player)=> (acc += player.moves.length - 1), 0);

        return <ul className="menu">
            <li className="exit">
                Exit Game
            </li>
            <li className="restart">
                Restart
            </li>
            <li className="clock">
                <Timer startTime={startTime} endTime={endTime}/>
                <hr/>
                {turns}
            </li>
        </ul>;
    }
}

export default GameMuenu;