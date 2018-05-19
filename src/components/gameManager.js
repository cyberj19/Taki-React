import React from "react";
import {getText} from "../modules/texts.jsm";
import GamePlay from "./gamePlay";

const gameTypes = ["regular", "tournament"];

class GameManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentGameType: null,
            currentGameId: null
        };

        this.setGame = this.setGame.bind(this);
        this.renderGameChooser = this.renderGameChooser.bind(this);
    }

    getGames() {
        return gameTypes; // in the future should get game list from server
    }

    setGame(gameType, id) {
        this.setState({
            currentGameType: gameType,
            currentGameId: id
        });
    }

    renderGameChooser(gameType, id) {
        return <div onClick={() => this.setGame(gameType, id || 0)}
                    data-info={getText(gameType + 'ChooserInfo')}
                    key={gameType + id}
                    className={`game-chooser game-chooser--${gameType}`}>
            {getText(gameType + 'Chooser')}
        </div>;
    }

    render() {
        const {currentGameType, currentGameId} = this.state;

        return ((currentGameType && currentGameId !== null) ? <GamePlay gameType={currentGameType} gameId={currentGameId} withComputer={true}/> : <div>
            <h1>{getText('gameChooserHeader')}</h1>
            {this.getGames().map(this.renderGameChooser)}
        </div>)
    }
}

export default GameManager;
