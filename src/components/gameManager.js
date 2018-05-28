import React from "react";
import {getText} from "../modules/texts.mjs";
import GamePlay from "./gamePlay";
import Dialog from "./dialog";

const gameTypes = ["regular", "tournament"];

class GameManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentGameType: null,
            currentGameId: null,
            playerName: null,
            gamesStats: [],
            settingsModal: false,
        };

        this.setGame = this.setGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.renderGameChooser = this.renderGameChooser.bind(this);
        this.openSettingsModal = this.openSettingsModal.bind(this);
        this.closeSettingsModal = this.closeSettingsModal.bind(this);
    }

    getGames() {
        return gameTypes; // in the future should get game list from server
    }
    endGame(stats, replay) {
        const {currentGameType, currentGameId, gamesStats} = this.state;

        this.setState({
            gameStats: [...gamesStats, {stats, gameType: currentGameType, gameId: currentGameId}],
            currentGameType: replay ? currentGameType : null,
            currentGameId: replay ? [currentGameId.split('-')[0], performance.now()].join('-') : null,
        });
    }

    setGame(gameType, id) {
        this.setState({
            currentGameType: gameType,
            currentGameId: id
        });
    }
    openSettingsModal() {
        this.setState({settingsModal: true});
    }
    closeSettingsModal() {
        this.setState({settingsModal: false});
    }
    inputChange(e) {
        this.setState({playerName: e.target.value.length ? e.target.value : null});
    }

    renderGameChooser(gameType, id) {
        return <div onClick={() => this.setGame(gameType, `${id || 0}-${performance.now()}`)}
                    data-info={getText(gameType + 'ChooserInfo')}
                    key={gameType + id}
                    className={`game-chooser game-chooser--${gameType}`}>
            {getText(gameType + 'Chooser')}
        </div>;
    }

    render() {
        const {currentGameType, currentGameId, playerName, settingsModal} = this.state;

        return ((currentGameType && currentGameId !== null) ?
            <GamePlay gameType={currentGameType} gameId={currentGameId} playerName={playerName} withComputer={true} endGameFn={this.endGame}/>
            : <div>
                <ul className="menu">
                    <li onClick={this.openSettingsModal} className="settings">
                        Settings
                    </li>
                </ul>
                <Dialog title={getText('settingsModalTitle')}
                        approveFunction={this.closeSettingsModal}
                        description={<div>Name: <input onBlur={this.inputChange} /></div>}
                        isOpen={settingsModal}
                        noCancel
                />
                <h1>{getText('gameChooserHeader')}</h1>
                {this.getGames().map(this.renderGameChooser)}
            </div>)
    }
}

export default GameManager;
