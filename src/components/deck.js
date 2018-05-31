import React from "react";
import {UNCOLORED_COLOR, cardsColors, CARDS} from "../modules/cards.mjs";
import {getText, toTimeString} from "../modules/texts.mjs";
import {ACTION_INIT_PACK, PLAYER_TYPE} from '../helpers/constants';
import ComputerPlayer from "./computerPlayer";
import Dialog from "./dialog";

class Deck extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            colorModalOpen: false,
            chosenColor: UNCOLORED_COLOR,
            chosenCardIndex: null
        };

        this.setColor = this.setColor.bind(this);
        this.openColorModal = this.openColorModal.bind(this);
        this.closeColorModal = this.closeColorModal.bind(this);
        this.colorDialogContent = this.colorDialogContent.bind(this);
    }

    setColor(color) {
        this.setState({chosenColor: color});
    }
    openColorModal(cardIndex) {
        this.setState({
            colorModalOpen: true,
            chosenCardIndex: cardIndex
        });
    }
    closeColorModal() {
        this.setState({
            colorModalOpen: false,
            chosenColor: UNCOLORED_COLOR,
            chosenCardIndex: null
        });
    }
    colorDialogContent() {
        const _this = this;
        return cardsColors.map(color => [<input type="radio" key={color} value={color} id={`dialog-color-${color}`} name="color"/>,
            <label key={color + 'l'} onClick={() => _this.setColor(color)} htmlFor={`dialog-color-${color}`}>{color}</label>]);
    }

    render() {
        const {
                name, cards, type, moves, turn, chooseCard, isCardEligible,
                heapCard, pullCard, activeTurn, endTaki, gameEnd, viewMode
            } = this.props,
            {colorModalOpen, chosenCardIndex, chosenColor} = this.state,
            avgMoveTime = moves && moves.length ? ((moves.filter(({type}) => type !== ACTION_INIT_PACK)
                .reduce(((acc, {duration}) => duration && (acc += duration)), 0)) / ((moves.length - 1) || 1)) / 1000 : 0,
            isPlayer = type === PLAYER_TYPE;

        return (<div className={`deck ${type} ${turn ? 'active' : ''}`}>
            {colorModalOpen && <Dialog title={getText('colorDialogTitle')}
                                       cancelFn={this.closeColorModal}
                                       approveFunction={() => chosenColor !== UNCOLORED_COLOR && chooseCard(chosenCardIndex, chosenColor) && this.closeColorModal()}
                                       description={this.colorDialogContent()}
                                       isOpen={colorModalOpen}
                                />}
            {!isPlayer && turn && activeTurn && !gameEnd &&
            <ComputerPlayer {...{cards, chooseCard, heapCard, pullCard, isCardEligible, endTaki, turn}}/>}
            <div className="deck-stats">
                <h2>{name || type}</h2>
                {moves && <h3>{getText('totalMoves')} {moves.length - 1}</h3>}
                {avgMoveTime ? <h3>{getText('avgMoves')} {toTimeString(avgMoveTime)}</h3> : null}
            </div>
            {!!cards.length && cards.map(({type: cardType, color}, i) => {
                const cardEligible = turn && isCardEligible({type: cardType, color});
                return <div key={i}
                            className="card"
                            {...(isPlayer || viewMode) ? {
                                onClick: () => cardEligible && activeTurn && (cardType === CARDS.COLOR ? this.openColorModal(i) : chooseCard(i)),
                                'data-card-type': cardType,
                                'data-color': color,
                                className: `card ${( cardEligible || !activeTurn ) ? 'active' : 'off'}`
                            } : {}
                            }
                />
            })}
            {isPlayer && endTaki && <div onClick={endTaki} className="end-taki-btn"/>}
        </div>)
    }
}


export default Deck;