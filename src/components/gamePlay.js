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
} from "../modules/cards.jsm";
import {getText} from "../modules/texts.jsm";



class GamePlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stack: [],
            players: [],
            heap: [],
            turn: 0,
            twoInAction: 0,
            activeAction: null,
            takenCardsArr: [],
        };

        this.endTaki = this.endTaki.bind(this);
        this.setHeap = this.setHeap.bind(this);
        this.initGame = this.initGame.bind(this);
        this.setStack = this.setStack.bind(this);
        this.pullCard = this.pullCard.bind(this);
        this.nextTurn = this.nextTurn.bind(this);
        this.startGame = this.startGame.bind(this);
        this.chooseCard = this.chooseCard.bind(this);
        this.setPlayers = this.setPlayers.bind(this);
        this.pullFromStack = this.pullFromStack.bind(this);
        this.isCardEligible = this.isCardEligible.bind(this);
        this.playerHasEligibleCard = this.playerHasEligibleCard.bind(this);
    }

    componentWillMount() {
        window.setTimeout( this.initGame, 10 );
    }

    pullFromStack() {
        if (!this.playerHasEligibleCard()) {
            const {turn, players} = this.state,
                takeCards = window.setInterval(() => {
                const {twoInAction, activeAction} = this.state,
                    twoOn = activeAction === CARDS.TWO,
                    newCard = this.pullCard();
                let tempTakenCardsArr = [...this.state.takenCardsArr];

                let newPlayers = [...players],
                    newCards = players[turn].cards,
                    newMoves = players[turn].moves;
                newCards.push({...newCard});
                if (!twoInAction) {
                    twoOn && tempTakenCardsArr.push({...newCard});
                    newMoves.push({type: ACTION_PULL_CARD,
                        cards: [...newCards],
                        time: performance.now(),
                        chosenCard: twoOn ? {...newCard} : tempTakenCardsArr})
                }
                else {
                    tempTakenCardsArr.push({...newCard});
                }
                newPlayers[turn] = {...newPlayers[turn], cards: [...newCards], moves: [...newMoves]};



                if (!twoInAction) {
                    this.nextTurn();
                    window.clearInterval(takeCards);

                    this.setState({
                        players: [...newPlayers],
                        twoInAction: 0,
                        activeAction: null,
                        takenCardsArr: []
                    });
                }
                else {
                    this.setState({
                        players: [...newPlayers],
                        twoInAction: twoInAction - 1,
                        takenCardsArr: [...tempTakenCardsArr]
                    });
                }

            }, 20);

        }
    }

    playerHasEligibleCard() {
        const {players, turn} = this.state,
            cards = players[turn].cards;

        return cards.reduce((accumulator, card) => {
            return accumulator || this.isCardEligible(card);
        }, false);
    }

    endTaki() {
        const {heap} = this.state,
            topCard = heap[heap.length - 1];

        this.nextTurn(topCard.type === CARDS.STOP ? 2 : 1);
        this.setState({activeAction: topCard.type === CARDS.TWO ? CARDS.TWO : null});
    }
    setPlayers() {
        // in the future we will get players from server
        const playerObj = {type: PLAYER_TYPE, cards: [], name: PLAYER_TYPE, moves: []},
              newPlayersArr = [{ ...playerObj}, {...playerObj, type: COMPUTER_TYPE, name: COMPUTER_TYPE}];

        this.setState({players: newPlayersArr});
    }


    setStack() {
        const {stack} = this.state;
        let {heap} = this.state;

        if (!!stack.length) return; // if stack isn't empty no need to set it again

        if (!!heap.length) { // if there is a heap already it will take the heap (and leave there only the top card)
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
        const {players, turn, heap, activeAction, twoInAction} = this.state,
            topCard = heap[heap.length - 1];
        let tempPlayers = [...players],
            tempHeap = [...heap],
            tempCard = {...players[turn].cards[cardIndex]},
            tempCards = [...players[turn].cards];

        if (this.isCardEligible(tempCard)) {

            tempHeap.push({...tempCard, ...{color: tempCard.color === UNCOLORED_COLOR ? (color || topCard.color) : tempCard.color}});
            tempCards.splice(cardIndex, 1);
            tempPlayers[turn].moves.push({type: ACTION_CHOOSE_CARD, cards: [...tempCards], time: performance.now(), chosenCard: {...tempCard}});
            tempPlayers[turn].cards = tempCards;
            this.setState({players: [...tempPlayers], heap: tempHeap});

            if (tempCard.type === CARDS.TAKI ||
                tempCard.type === CARDS.PLUS ||
                activeAction === CARDS.TAKI) {
                tempCard.type === CARDS.TAKI && this.setState({activeAction: CARDS.TAKI});
            }
            else {
                tempCard.type === CARDS.TWO && this.setState({activeAction: CARDS.TWO, twoInAction: twoInAction + 2});
                this.nextTurn(tempCard.type === CARDS.STOP ? 2 : 1);
            }
            return true;
        }
        return false;
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
        const {turn, players} = this.state,
            nextTurn = (turn + turns) % players.length;

        this.setState({turn: nextTurn });
    }
    setHeap() {
        this.setState({heap: [this.pullCard(HEAP_TYPE)]});
    }
    initGame() {
        this.setPlayers();
        this.setStack();
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

        this.setState({stack: tempStack,
            players: players.map((player, i) => {return {...player, ...{cards: [...newCards[i]], moves: [{type: ACTION_INIT_PACK, cards: [...newCards[i]], time: performance.now()}]} }}),
            turn: 0,
        });
    }


    render() {
        const {players, heap, stack, turn, notAllowed, activeAction} = this.state;
        if (stack.length) {
            const topCard = heap[heap.length - 1],
                  isPlayer = players[turn].type === PLAYER_TYPE,
                  takiMode = activeAction === CARDS.TAKI;

            return (<div className="board" id="board">
                {players.map((player, i) => Deck(player, i === turn, this.chooseCard, this.isCardEligible, topCard, this.pullFromStack, i === turn && takiMode && this.endTaki))}

                <div onClick={isPlayer ? this.pullFromStack : ()=>{}} className="pack stack">
                    <div className="card"/>
                </div>
                <div className={`pack heap ${notAllowed ? 'not-allowed' : ''}`}>
                    {topCard && <div className="card" data-card-type={topCard.type} data-color={topCard.color}/>}
                </div>
            </div>);
        }
        return <div>Loading...</div>;
    }
}

export default GamePlay;
