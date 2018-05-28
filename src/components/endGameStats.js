import React from "react";
import {
    ACTION_INIT_PACK,
} from '../helpers/constants';
import {getText, toTimeString} from "../modules/texts.mjs";


class EndGameStats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            areYouSureOpen: false,
            statsOpen: false,
            modalType: null,
        };

        this.getEndStats = this.getEndStats.bind(this);
    }

    getEndStats() {
        const moves = this.props.players.map(({moves, type, name}) => ({
            name,
            oneCardTotal: moves.filter(({cards}) => cards.length === 1).length,
            playerTotalMoves: moves.length - 1,
            playerAverageTime: moves.length ? ((moves.filter(({type : moveType}) => moveType !== ACTION_INIT_PACK)
                .reduce(((acc, {duration})=> duration && (acc += duration)), 0)) / ((moves.length - 1) || 1)) / 1000 : 0,
            playerType: type,
        }));
        return [{
            playerType: 'stats',
            name: 'stats',
            oneCardTotal: getText('oneCardTotal'),
            playerAverageTime: getText('playerAverageTime'),
            playerTotalMoves: getText('playerTotalMoves')
        }, ...moves].map(({playerType, name, oneCardTotal, playerAverageTime, playerTotalMoves}, i) => (<ul key={i + name} className={`player-stats ${playerType}`}>
            <li>{name}</li>
            <li>{oneCardTotal}</li>
            <li>{typeof playerAverageTime === 'string' ? playerAverageTime : toTimeString(playerAverageTime)}</li>
            <li>{playerTotalMoves}</li>
        </ul>));
    }


    render() {
        const {startTime, endTime, players, noCancel} = this.props,
            gameTime = (endTime - startTime) / 1000,
            totalTurns = players.reduce((acc, {moves})=> (acc += moves.length - 1), 0);

        return <div>
            <strong>This game played {parseInt(gameTime / 60)} minutes and {parseInt(gameTime % 60)} seconds, during {totalTurns} moves</strong><br/>
            {this.getEndStats()}<br/>
            Click "OK" to play again {noCancel ? '' : 'and "Cancel" to go to main menu'}
        </div>;
    }
}

export default EndGameStats;