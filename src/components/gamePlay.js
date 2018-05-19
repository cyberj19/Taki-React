import React from "react";
import Deck from "./deck"
import {PLAYER_TYPE, COMPUTER_TYPE, HEAP_TYPE} from '../helpers/constants';
import {cardsColors, regularCards, unColoredCards, UNCOLORED_COLOR} from "../modules/cards.jsm";
import {getText} from "../modules/texts.jsm";



class GamePlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stack: [],
            players: [],
            heap: [],
        };

        this.initGame = this.initGame.bind(this);
        this.setStack = this.setStack.bind(this);
        this.pullCard = this.pullCard.bind(this);
        this.startGame = this.startGame.bind(this);
        this.chooseCard = this.chooseCard.bind(this);
        this.setPlayers = this.setPlayers.bind(this);
    }

    componentWillMount() {
        window.setTimeout( this.initGame, 10 );
    }

    setPlayers() {
        // in the future we will get players from server
        const playerObj = {type: PLAYER_TYPE, cards: [], name: PLAYER_TYPE, moves: []},
              newPlayersArr = [{ ...playerObj}, {...playerObj, type: COMPUTER_TYPE}];

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

    chooseCard() {

    }
    initGame() {
        this.setPlayers();
        this.setStack();

        window.setTimeout( this.startGame, 10 )
    }

    pullCard(rquire) {
        this.setStack();
        const {stack} = this.state;

        let cardLoc = Math.ceil(Math.random() * (stack.length - 1)); // Every pull we shuffeling
        while (rquire === HEAP_TYPE && unColoredCards.indexOf(stack[cardLoc].type) > -1) {
            cardLoc = Math.ceil(Math.random() * (this.stack.length - 1));
        }
        const newCard = {...stack[cardLoc]};
        this.setState({stack: stack.splice(cardLoc, 1)});
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

        this.setState({stack: tempStack, players: players.map((player, i) => {return {...player, ...{cards: newCards[i]} }})});
    }


    render() {
        const {gameType, gameId} = this.props,
          {players, heap, stack} = this.state;

        return (<div className="board" id="board">

            {players.map(player => Deck(player, true, this.chooseCard))}

            <div className="pack stack">
                <div className="card"/>
            </div>
            <div className="pack heap">
                <div className="card" data-card-type="TAKI" data-color="blue"/>
            </div>


        </div>);
    }
}

export default GamePlay;
