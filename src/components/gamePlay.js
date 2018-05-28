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
import GameMenu from './gameMenu';
import EndGameStats from './endGameStats';
import {getText} from "../modules/texts.mjs";
import Dialog from "./dialog";


class GamePlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stack: [],
            players: [],
            heap: [],
            turn: 0,
            activeTurn: true,
            cantPullModal: false,
            twoInAction: 0,
            winner: null,
            activeAction: null,
            takenCardsArr: [],
            startTime: performance.now(),
            lastAction: performance.now(),
            endTime: null,
        };

        this.endTaki = this.endTaki.bind(this);
        this.setHeap = this.setHeap.bind(this);
        this.initGame = this.initGame.bind(this);
        this.setStack = this.setStack.bind(this);
        this.pullCard = this.pullCard.bind(this);
        this.nextTurn = this.nextTurn.bind(this);
        this.startGame = this.startGame.bind(this);
        this.setEndTime = this.setEndTime.bind(this);
        this.chooseCard = this.chooseCard.bind(this);
        this.setPlayers = this.setPlayers.bind(this);
        this.cantPullCard = this.cantPullCard.bind(this);
        this.pullFromStack = this.pullFromStack.bind(this);
        this.isCardEligible = this.isCardEligible.bind(this);
        this.getWinnerRender = this.getWinnerRender.bind(this);
        this.closePullCardModal = this.closePullCardModal.bind(this);
        this.playerHasEligibleCard = this.playerHasEligibleCard.bind(this);
    }
    componentWillMount() {
        window.setTimeout( this.initGame, 10 );
    }

    componentDidUpdate(preProps) {
        if (preProps.gameId !== this.props.gameId) { // restart same game
            window.setTimeout( this.initGame, 10 );
        }
    }

    pullFromStack() {
        if (!this.playerHasEligibleCard(true)) {
            this.setState({activeTurn: false});

            const {turn, players, lastAction} = this.state,
                takeCards = window.setInterval(() => {
                const {twoInAction, activeAction} = this.state,
                    twoOn = activeAction === CARDS.TWO,
                    newCard = this.pullCard();
                let tempTakenCardsArr = [...this.state.takenCardsArr],
                    newPlayers = [...players],
                    newCards = players[turn].cards,
                    newMoves = players[turn].moves;

                newCards.push({...newCard});
                if (!twoInAction) {
                    twoOn && tempTakenCardsArr.push({...newCard});
                    newMoves.push({
                        type: ACTION_PULL_CARD,
                        cards: [...newCards],
                        time: lastAction,
                        duration: performance.now() - lastAction,
                        chosenCard: twoOn ? [...tempTakenCardsArr] : {...newCard}
                    })
                }
                else tempTakenCardsArr.push({...newCard});

                newPlayers[turn] = {...newPlayers[turn], cards: [...newCards], moves: [...newMoves]};
                if (!twoInAction) {
                    this.nextTurn();
                    window.clearInterval(takeCards);

                    this.setState({
                        players: [...newPlayers],
                        twoInAction: 0,
                        activeTurn: true,
                        lastAction: performance.now(),
                        activeAction: null,
                        takenCardsArr: []
                    });
                }
                else {
                    this.setState({
                        players: [...newPlayers],
                        twoInAction:  twoInAction === 2 ? 0 : twoInAction - 1,
                        takenCardsArr: [...tempTakenCardsArr]
                    });
                }
            }, 20);
        }
        else {
            this.cantPullCard();
        }
    }

    playerHasEligibleCard(considerSuperTaki) {
        const {players, turn} = this.state,
            cards = players[turn].cards;

        return cards.reduce((accumulator, card) => {
            if (considerSuperTaki && card.type === CARDS.TAKI && card.color === UNCOLORED_COLOR) return accumulator;
            return accumulator || this.isCardEligible(card);
        }, false);
    }

    endTaki() {
        this.setState({activeTurn: false});

        const {heap} = this.state,
            topCard = heap[heap.length - 1];

        this.nextTurn([CARDS.STOP, CARDS.PLUS].indexOf(topCard.type) > -1 ? 2 : 1);
        this.setState({
            activeAction: topCard.type === CARDS.TWO ? CARDS.TWO : null,
            twoInAction: topCard.type === CARDS.TWO ? 2 : 0,
            activeTurn: true
        });
    }
    setPlayers() {
        // in the future we will get players from server
        const playerObj = {type: PLAYER_TYPE, cards: [], name: this.props.playerName || PLAYER_TYPE, moves: []},
              newPlayersArr = [{ ...playerObj}, {...playerObj, type: COMPUTER_TYPE, name: COMPUTER_TYPE}];

        this.setState({players: newPlayersArr});
    }

    setStack(forceInit) {
        const {stack} = this.state;
        let {heap} = this.state;

        if (!forceInit && !!stack.length) return; // if stack isn't empty no need to set it again

        if (!forceInit && !!heap.length) { // if there is a heap already it will take the heap (and leave there only the top card)
            this.setState({heap: heap.pop(), stack: heap});
        }
        else { // there is a need to create a new stack from the constants
            let tmpStack = [];
            for (let i = 0; i < 2; ++i) {
                regularCards.forEach(type => {
                    cardsColors.forEach(color => {
                        tmpStack.push({type, color});
                    });
                });
            }
            for (let j = 0; j < 4; ++j) {
                unColoredCards.forEach(type => {
                    tmpStack.push({type, color: UNCOLORED_COLOR});
                });
            }
            this.setState({stack: tmpStack});
        }
    }

    chooseCard(cardIndex, color) {
        this.setState({activeTurn: false});

        const {players, turn, heap, activeAction, twoInAction, lastAction} = this.state,
            topCard = heap[heap.length - 1];
        let tempPlayers = [...players],
            tempHeap = [...heap],
            tempCard = {...players[turn].cards[cardIndex]},
            tempCards = [...players[turn].cards];

        if (this.isCardEligible(tempCard)) {
            tempHeap.push({...tempCard, ...{color: tempCard.color === UNCOLORED_COLOR ? (color || topCard.color) : tempCard.color}});
            tempCards.splice(cardIndex, 1);
            tempPlayers[turn].moves.push({
                type: ACTION_CHOOSE_CARD,
                cards: [...tempCards],
                time: lastAction,
                duration: performance.now() -  lastAction,
                chosenCard: {...tempCard}
            });

            tempPlayers[turn].cards = tempCards;
            this.setState({players: [...tempPlayers], heap: tempHeap});

            if (tempCard.type === CARDS.TAKI ||
                tempCard.type === CARDS.PLUS ||
                activeAction === CARDS.TAKI) {
                tempCard.type === CARDS.TAKI && this.setState({activeAction: CARDS.TAKI});
            }
            else {
                tempCard.type === CARDS.TWO && this.setState({activeAction: CARDS.TWO, twoInAction: twoInAction + 2});
                this.nextTurn(tempCard.type === CARDS.STOP ? 2 : 1)
            }
            this.setState({
                ...(!tempCards.length && tempCard.type !== CARDS.PLUS ? {
                    winner: turn,
                    endTime: performance.now(),
                    activeTurn: false
                } : {
                    activeTurn: true
                }),
                lastAction: performance.now()
            });
            return true;
        }
        return false;
    }

    setEndTime() {
        this.setState({endTime: performance.now()});
    }

    isCardEligible(card) {
        const {heap, activeAction} = this.state,
            topCard = heap[heap.length - 1];

        return activeAction === CARDS.TWO ? card.type === CARDS.TWO :
               activeAction === CARDS.TAKI ? topCard.color === card.color :
            !(!!topCard.type
                && card.type !== topCard.type
                && card.color !== UNCOLORED_COLOR
                && card.color !== topCard.color)
    }

    nextTurn(turns = 1) {
        const {turn, players, winner} = this.state,
            nextTurn = (turn + turns) % players.length;

        winner === null && this.setState({turn: nextTurn });
    }
    setHeap() {
        this.setState({heap: [this.pullCard(HEAP_TYPE)]});
    }
    cantPullCard() {
        this.setState({cantPullModal: true});
    }
    closePullCardModal() {
        this.setState({cantPullModal: false});
    }

    initGame() {
        this.setPlayers();
        this.setStack(true);
        window.setTimeout( this.setHeap, 50 );
        window.setTimeout( this.startGame, 100 );
    }
    pullCard(rquire) {
        this.setStack();
        const {stack} = this.state;
        let tempStack = [...stack];

        let cardLoc = Math.ceil(Math.random() * (tempStack.length - 1)); // Every pull we shuffeling
        while (rquire === HEAP_TYPE && tempStack[cardLoc].color === UNCOLORED_COLOR) {
            cardLoc = Math.ceil(Math.random() * (tempStack.length - 1));
        }
        const newCard = {...tempStack[cardLoc]};
        tempStack.splice(cardLoc, 1);
        this.setState({stack: tempStack});
        return newCard;
    };
    startGame() {
        const playersCount = this.state.players.length,
            {players, stack} = this.state; // init empty array for each player

        let tempStack = [...stack],
            newCards = players.map(()=>[]);

        for (let i = 0; i < 8 * playersCount; ++i) {
            let cardLoc = Math.ceil(Math.random() * (tempStack.length - 1));
            newCards[i % playersCount].push(tempStack[cardLoc]);
            tempStack.splice(cardLoc, 1);
        }

        this.setState({
            stack: tempStack,
            players: players.map((player, i) => {return {...player, ...{cards: [...newCards[i]], moves: [{type: ACTION_INIT_PACK, cards: [...newCards[i]], time: performance.now()}]} }}),
            turn: 0,
            winner: null,
            startTime: performance.now(),
            lastAction: performance.now(),
            endTime: null,
            activeAction: null,
            twoInAction: 0,
            activeTurn: true,
        });
    }

    getWinnerRender() {
        const {winner, players, startTime, endTime} = this.state,
            winnerObj = players[winner];

        if (winner !== null) {
            const stats = this.state.players.map(({moves}) => moves)
                .reduce((pre, move) => pre = [...pre, ...move], []).sort((a ,b) => a.time > b.time ? 1 : -1);

            return [
                (winnerObj.type === PLAYER_TYPE ? <div key="pyro" className="pyro"/> : null),
                <Dialog key="winDialog" isOpen title={`${winnerObj.name} has Won the game`}
                        cancelFn={() => this.props.endGameFn(stats)}
                        description={<EndGameStats {...{players, startTime, endTime}}/>}
                        approveFunction={() => this.props.endGameFn(stats, true)}/>
            ];
        }
    }

    render() {
        const {endGameFn} = this.props,
            {players, heap, winner ,turn, notAllowed, activeAction, cantPullModal, activeTurn, startTime, endTime} = this.state;

        if (players[0] && players[0].moves.length) {
            const topCard = heap[heap.length - 1],
                isPlayer = players[turn].type === PLAYER_TYPE,
                takiMode = activeAction === CARDS.TAKI,
                deckProps = i => ({
                    activeTurn,
                    turn: i === turn,
                    chooseCard: this.chooseCard,
                    gameEnd: winner !== null,
                    isCardEligible: this.isCardEligible,
                    heapCard: topCard,
                    pullCard: this.pullFromStack,
                    endTaki: i === turn && takiMode && this.endTaki
                });

            return (<div className="board">
                <GameMenu players={players} startTime={startTime} endTime={endTime} setEndTime={this.setEndTime} endGameFn={endGameFn}/>
                {this.getWinnerRender()}
                <Dialog approveFunction={this.closePullCardModal} title={getText('CantPullTitle')}
                        description={getText('CantPullDesc' + (!isPlayer ? 'NotPlayer' : (takiMode ? 'Taki' : '')))}
                        isOpen={cantPullModal} noCancel/>
                {players.map((player, i) => <Deck key={i} {...player} {...deckProps(i)}/>)}
                <div onClick={(isPlayer && !takiMode) ? this.pullFromStack : this.cantPullCard} className="pack stack">
                    <div className={`card active ${isPlayer && activeTurn && (this.playerHasEligibleCard() ? '' : 'required')}`}/>
                </div>
                <div className={`pack heap ${notAllowed ? 'not-allowed' : ''}`}>
                    {topCard && <div className="card" data-card-type={topCard.type} data-color={topCard.color}/>}
                </div>
            </div>);
        }
        return <div>Loading...</div>
    }
}

export default GamePlay;
