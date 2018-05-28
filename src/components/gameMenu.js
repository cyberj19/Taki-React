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
import EndGameStats from './endGameStats';
import {getText} from "../modules/texts.mjs";
import Dialog from "./dialog";

const RESTART = 'restart';
const EXIT = 'exit';

class GameMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            areYouSureOpen: false,
            statsOpen: false,
            modalType: null,
        };

        this.openModal = this.openModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.getStatsDialog = this.getStatsDialog.bind(this);
        this.getValidateDialog = this.getValidateDialog.bind(this);
        this.approveStatsModal = this.approveStatsModal.bind(this);
        this.approveValidateModal = this.approveValidateModal.bind(this);
    }

    openModal(type) {
        this.setState({
            areYouSureOpen: true,
            modalType: type
        });
    }
    cancelModal() {
        this.setState({
            areYouSureOpen: false,
            modalType: null
        });
    }
    approveValidateModal() {
        this.props.setEndTime();

        this.setState({
            areYouSureOpen: false,
            statsOpen: true
        });
    }
    approveStatsModal() {
        const {players, endGameFn} = this.props,
                {modalType} = this.state,
                stats = players.map(({moves}) => moves)
                    .reduce((pre, move) => pre = [...pre, ...move], [])
                    .sort((a ,b) => a.time > b.time ? 1 : -1);

        endGameFn(stats, modalType === RESTART);

        this.setState({
            areYouSureOpen: false,
            statsOpen: false,
            modalType: null,
        });
    }

    getValidateDialog() {
        const {areYouSureOpen} = this.state;

        return <Dialog key="validateDialog" isOpen={areYouSureOpen} title={getText('areYouSureTitle')}
                       cancelFn={this.cancelModal}
                       description={getText('areYouSureDesc')}
                       approveFunction={this.approveValidateModal}/>
    }

    getStatsDialog() {
        const {players, startTime, endTime} = this.props,
              {statsOpen} = this.state;

        return <Dialog key="statsDialog" isOpen={statsOpen} title={getText('youLost')}
                       noCancel
                       description={<EndGameStats noCancel {...{players, startTime, endTime}}/>}
                       approveFunction={this.approveStatsModal}/>
    }

    render() {
        const {players, startTime, endTime} = this.props,
            turns = players.reduce((acc, player)=> (acc += player.moves.length - 1), 0);

        return [
            this.getValidateDialog(),
            this.getStatsDialog(),
            <ul key="gameMenu" className="menu">
                <li onClick={() => this.openModal(EXIT)} className="exit">
                    Exit game
                </li>
                <li onClick={() => this.openModal(RESTART)} className="restart">
                    Restart
                </li>
                <li className="clock">
                    <Timer startTime={startTime} endTime={endTime}/>
                    <hr/>
                    {turns}
                </li>
            </ul>
        ];
    }
}

export default GameMenu;