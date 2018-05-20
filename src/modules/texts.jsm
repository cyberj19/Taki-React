
const texts = {
    gameChooserHeader: 'Choose game to begin:',
    tournamentChooser: 'Tournament Game',
    regularChooser: 'Regular Game',
    tournamentChooserInfo: 'Play tournament game - you will play 3 games in a row and the winner will eb the one with the highest score',
    regularChooserInfo: 'Play regular TAKI game',
    totalMoves: 'Total moves:',
    colorDialogTitle: 'Please choose color:',
};

export const getText = textKey => {
    return texts[textKey] || textKey;
};